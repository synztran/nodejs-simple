const express = require('express');
const router = express.Router();
const req = require('request');
const bcrypt = require("bcryptjs");
const fs = require('fs');
const readline = require('readline');
const jwt = require('jsonwebtoken');
const reqHeader = require('request');
const config = require('./../lib/comon/config');
const utils = require('./../lib/comon/utils');
const cookieParser = require('cookie-parser'); 
const session = require('express-session');
router.use(cookieParser());
// var token = jwt.sign({foo: 'bar'}, 'shhhhh');
const tokenList = {};

// jwt.sign({foo: 'bar'}, privateKey, {algorithm: 'RS256'}, function(err, token){
//     console.log(token)
// });

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'docs/upload/');
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
});
var mongoose = require('mongoose');
var db = mongoose.connection;
const fileFilter = (req, file, cb)=>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg'){
        cb(null, false);
    }else{
        cb(null, true);
    }
}

const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024*1024*5
    },
    // fileFilter: fileFilter
});
// var imgPath = 'docs/img_1435.JPG';
var Account = require('./../db/model/account');
var AdmAccount = require('./../db/model/accadmin');
var Product  = require('./../db/model/product');
var Category = require('./../db/model/category');
var Image = require('./../db/model/image');
var userToken = require('./../db/model/token');
var TokenCheckMiddleware = require('./../lib/check/checktoken');
// example = require('./../lib/js/listAccount.js')


const PinCheckMiddleware = async (req, res, next) => {
    // const passcode = req.headers['x-passcode'];
    const role = req.headers['role'];
    console.log(req)
    console.log(req.get('role'));
   
    // console.log(config.admin);
    // console.log(passcode)
    if (role === "admin") {
      try {
        next();
      } catch (err) {
        console.error(err);
        return res.status(401).json({
          message: 'Unauthorized access.',
        });
      }
    } else {
      return res.status(403).send({
        message: 'Only allow for admin role.',
      });
    }
}

const options = {
    
    url: 'http://localhost:5000/profile',
    method: 'GET',
    headers:{
        'x-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMzQ1NiIsImlhdCI6MTU3NjA2MDk2NSwiZXhwIjoxNTc2MDYxMDI1fQ.obUYFFsvscovK0uq5o-PX3OCNP7a0NOdGqrNqm0KBFs'
    }
};
function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      const info = JSON.parse(body);
      console.log(info);
    }
}
// reqHeader(options, PinCheckMiddleware);

// reqHeader(options, function(err, res, body){
//     let info = JSON.parse(body);
//     console.log(info);
// })
// init
router.get("/signin", function(req, res) {
    res.render("homePage");
});

router.get("/test", function(req, res) {
    res.render("testPage");
});

router.get("/signup", function(req, res) {
    res.render("registerPage");
});

router.get('/', TokenCheckMiddleware, function(req, res){
    console.log(req.session.Admin);
    if(!req.session.Admin){
        res.redirect('api/signin')
    }else{
        var admin = req.session.Admin
        res.render('mainPage',{
            fname:  admin['fname'],
            lname: admin['lname']
        });
    }
    
});

router.get('/messenger', TokenCheckMiddleware, function(req, res){
    res.render('messengerPage');
})

router.get('/list-room', TokenCheckMiddleware, function(req, res){
    res.render('listroomPage');
})

router.get('/listcreated', function(req,res){
    res.render('listCreated',{
        // 'listCreated' : ''
    });
})


router.get("/success", function(req, res) {

    res.render("successPage");
   
});

router.post("/signup", function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    var data = {
        "email": email,
        "password": password
    }

    db.collection('accounts').insertOne(data, function(err, collection) {
        if (err) throw err;
        console.log("successfully");
    });
    return res.redirect('success');
})

router.get('/list' ,function(req, res) {
    AdmAccount.find({}, function(err, docs) {
        res.render('listAccount', {
            "listAccount": docs
        });
    });
    

});

router.delete('/delete/:id', async (req, res) => {
    try {
        var result = await Account.deleteOne({ _id: req.params.id }).exec();
        res.send(result);

    } catch (err) {
        res.status(500).send(err);
    }
});

router.get("/people", async (req, res) => {
    var resultArray = [];
    try {
        var result = await Account.find().exec();
        // res.send(result);
        resultArray.push(result);
        res.status(200).send({
            success: {
                // status: "success",
                internalMessage: "List user have been created",
                code: 200
            }
        });
    } catch (err) {
        res.status(500).send({
            error: {
                internalMessage: "fail api",
                code: 500
            }
        });

    }
    console.log(resultArray);
});

router.get("/person/:id", async (req, res) => {
    console.log(req.params);
    try {
        var account = await Account.findById(req.params.id).exec();
        res.send(account);
    } catch (err) {
        res.status(500).send(err);
    }
});



/*------------------For mobile-------------------*/
router.put("/account/edit/:id", async (req, res) => {
    try {
        console.log(req.params);
        console.log(req.body);
        var account = await Account.findById(req.params
            .id).exec();
        account.set(req.body);
        var result = await account.save();
        res.send(result);

    } catch (err) {
        console.log(err);
        res.status(200).send(err);
    }
});
/*-----------------------------------------------*/
// load db on form
router.get("/account/edit/:id", async (req, res) => {
    try {
        Account.findById(req.params
            .id,
            function(err, account) {
                res.render('editAccount', {
                    title: 'Edit Account',
                    account: account
                });
            });
    } catch (err) {
        console.log(err);
        res.status(200).send(err);
    }
});
// update db to mongo
router.post("/account/edit/:id", upload.single('picture') ,async (req, res) => {
    console.log(req.body);
    console.log(req.file);
    try {
        var account = await Account.findById(req.params
            .id).exec();
        if (!account) {
            return res.status(400).send({
                status: "error",
                message: "The user does not exist "
            });
        }
        req.body.password = bcrypt.hashSync(req.body.password, 10);

        account.set(req.body);

        //     Account(req.file.path).save(function(err, data){
        //     if(err) throw err;
        //     res.json(data);
        // })
        var result = await account.save();

        return res.redirect('/list');


    } catch (err) {
        console.log(err);
        res.status(200).send(err);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        var account = await AdmAccount.findOne({ email: req.body.email }).exec();
        var active =  await AdmAccount.findOne({ $and:[{email: req.body.email}, {active: true}]});
        
        if (!account) {
            return res.status(400).send({
                status: "error",
                message: "The user does not exist "
            });
        }
        if (!bcrypt.compareSync(req.body.password, account.password)) {
            return res.status(400).send({
                status: "error",
                message: "The password is not correct"
            });
        }
        if(!active){
            return res.status(400).send({
                status: "error",
                message: "Please active your account"
            })
        }
        
        const user = {
            "email": req.body.email,
            "password": req.body.password
        }
        const token = jwt.sign(user, config.secret, {
            expiresIn: config.tokenLife,
        });
        const refreshToken = jwt.sign(user, config.refreshTokenSecret, {
            expiresIn: config.refreshTokenLife
        });
        tokenList[refreshToken] = user;
        const response = {
            token,
            refreshToken,
        }
        // var check =  userToken.find({ email: req.body.email }, async (err, docs) => {
        //     if (docs.length) {
        //         // userToken.set(req.body);
        //         db.collection('usertokens').updateOne({email: req.body.email}, {$set:{token: response.token, refreshToken: response.refreshToken}})
        //     } else {
        //         var accToken = new userToken({
        //             email: req.body.email,
        //             token: response.token,
        //             refreshToken: response.refreshToken
        //         });
        //         var result =  accToken.save();
        //     }
        // }).exec();
      
            res.cookie('x-token', response.token);
            req.session.Admin = {
                email: account['email'],
                fname: account['fname'],
                lname: account['lname'],
                id : account['_id']
            }
            console.log(req.session.Admin)
            // res.cookie('x-refresh-token', response.refreshToken);
            // res.cookie('x-email', user.email);
            // res.cookie('x-fname', account.fname);
            // res.cookie('x-lname', account.lname);

            // res.send(token);
            res.redirect('./');
        
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/register", upload.single('picture'),  (req, res) => {
    console.log(req.file);

    // console.log(req);
    // console.log(req.body.fileuploader-list-picture);
    console.log(req.body);
    try {
        var check =  AdmAccount.find({ email: req.body.email }, async (err, docs) => {
            if (docs.length) {
                res.status(400).json({
                    code: 400,
                    message: "email already exists"
                })
            } else {
                req.body.password = bcrypt.hashSync(req.body.password, 10);
                var account = new AdmAccount({
                    fname: req.body.fname,
                    lname: req.body.lname,
                    email: req.body.email,
                    password: req.body.password,
                    picture: {
                        path: req.file.path,
                        size: req.file.size
                    },
                    active: true
                });
                var result =  account.save();
                // res.send(result);
                res.redirect('/');
            }
        }).exec();
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/refresh_token', async(req, res) =>{
    const {refreshToken} = req.body;
    if((refreshToken) && (refreshToken in tokenList)){
        try{
            await utils.verifyJwtToken(refreshToken, config.refreshTokenSecret);
            const user = tokenList[refreshToken];
            const token = jwt.sign(user, config.secret, {
                expiresIn: config.tokenLife,
            });
            const response = {
                token,
            }
            res.status(200).json(response);
        }catch(err){
            console.log(err);
            res.status(403).json({
                message: 'Invalid refresh token'
            });
        }
    }else{
        res.status(400).json({
            message: 'Invalid request'
        });
    }
});


router.get('/profile',TokenCheckMiddleware, (req, res) => {
    
    res.json(req.decoded)
})


router.post("/created", async (req, res) => {
    console.log(req.body);
    var datecreated = req.body.created;
    var todayStart = new Date(datecreated);
    var todayEnd = new Date(datecreated);
    todayEnd.setHours(23);
    todayEnd.setMinutes(59);
    todayEnd.setSeconds(59);
    todayEnd.setMilliseconds(999);

    console.log("start " + todayStart.toISOString());
    console.log("end " + todayEnd.toISOString());

    try {
        if(datecreated){
            var result = await Account.find({ created: { $gte: (todayStart), $lte: todayEnd } }, function(err,docs){
                // res.render('listCreated', {
                //     'listCreated': docs
                // })
            });
            console.log(result);
            res.send({
                "date": req.body,
                "startDate": todayStart,
                "endDate": todayEnd,
                "count": result.length,
                result,
            });
           
        }else{
            // res.render('/listCreated');
            Account.find({}, function(err, docs) {
                res.render('listCreated', {
                    "listCreated": docs
                });
            });
        }
       
    } catch (err) {
        res.status(200).send(err);
    }
});

router.post('/product/add', async(req, res)=>{
    console.log(req.body)
    try{
        var product = new Product({
            product_id : req.body.productid,
            product_name : req.body.productname,
            category : req.body.category,
            status_gb : req.body.status,
            color : req.body.color,

        });
        var result = product.save();
        res.send(product)
    }catch(err){
        res.status(500).send(err);
    }
})

router.post('/category/add', async(req, res)=>{
    console.log(req.body)
    try{

        var check =  await Category.find({ category_id: req.body.catid }, async (err, docs) => {
            if (docs.length) {
                res.status(400).json({
                    code: 400,
                    message: "category id already exists"
                })
            } else {
                var category = new Category({
                    category_id : req.body.catid,
                    category_name: req.body.catname,
                    color: req.body.color,
                    date_start: req.body.date_start,
                    date_end: req.body.date_end,
                    date_payment: req.body.date_payment,
                    min_price: req.body.min_price,
                    max_price: req.body.max_price
        
        
                })
                var result = category.save();
                res.send(result);
        
            }
        }).exec();
    }catch(err){
        res.status(500).send(err);
    }
})

// router.get("/category/edit/:id", async (req, res) => {
//     try {
//         Category.findById(req.params
//             .id,
//             function(err, account) {
//                 res.render('editAccount', {
//                     title: 'Edit Account',
//                     account: account
//                 });
//             });
//     } catch (err) {
//         console.log(err);
//         res.status(200).send(err);
//     }
// });

// update db to mongo
// , upload.single('picture') 
router.post("/category/edit/:id",async (req, res) => {
    console.log(req.body);
    // console.log(req.file);
    try {
        var check = await Category.findById(req.params
            .id).exec();
            console.log(check)
        if (!check) {
            return res.status(400).send({
                status: "error",
                message: "The category id does not exist "
            });
        }

        check.set({
            // category_id : req.body.catid,
            category_name: req.body.catname,
            status_gb: req.body.status,
            color: req.body.color,
            date_start: req.body.date_start,
            date_end: req.body.date_end,
            date_payment: req.body.date_payment,
            min_price: req.body.min_price,
            max_price: req.body.max_price
        });

       
        var result = await check.save();
        res.status(200).send(result)
        // return res.redirect('/list');


    } catch (err) {
        console.log(err);
        res.status(200).send(err);
    }
});

module.exports = router;