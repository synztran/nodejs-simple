const express = require('express');
const router = express.Router();
const request = require('request');
const bcrypt = require("bcryptjs");
const fs = require('fs');
const readline = require('readline');
const jwt = require('jsonwebtoken');
const reqHeader = require('request');
const nodemailer = require('nodemailer');
const config = require('./../lib/comon/config');
const utils = require('./../lib/comon/utils');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const livereload = require('connect-livereload');
const app = express();
router.use(cookieParser());
// var token = jwt.sign({foo: 'bar'}, 'shhhhh');
const tokenList = {};



// jwt.sign({foo: 'bar'}, privateKey, {algorithm: 'RS256'}, function(err, token){
//     console.log(token)
// });

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'docs/upload/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
});
var mongoose = require('mongoose');
var db = mongoose.connection;
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, false);
    } else {
        cb(null, true);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    // fileFilter: fileFilter
});
// var imgPath = 'docs/img_1435.JPG';
var Account = require('./../db/model/account');
var Image = require('./../db/model/image');
var userToken = require('./../db/model/token');
var Tracking = require('./../db/model/tracking');
var Product  = require('./../db/model/product');
var Category = require('./../db/model/category')
var TokenCheckMiddleware = require('./../lib/check/checktoken');
var TokenUserCheckMiddleware = require('./../lib/check/checktokenproduct.js')
var SessionCheckMiddleware = require('./../lib/check/checksession');

app.use(session({
	saveUninitialized: true, 
	name: "mycookie",
	resave: true,
    secret: config.secret, 
    cookie: { 
		secure: false,
		maxAge: 180000
	}
}));
app.use(livereload())

router.post("/login", async (req, res, next) => {
    try {
        var account = await Account.findOne({ email: (req.body.email).toLowerCase() }).exec();
        var active = await Account.findOne({ $and: [{ email: (req.body.email).toLowerCase() }, { active: true }] });

        // console.log(account);

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
        if (!active) {
            return res.status(400).send({
                status: "error",
                message: "Please active your account"
            })
        }

        const user = {
            "email": (req.body.email).toLowerCase(),
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
        var check = userToken.find({ email: (req.body.email).toLowerCase() }, async (err, docs) => {
            if (docs.length) {
                // userToken.set(req.body);
                db.collection('usertokens').updateOne({ email: req.body.email }, { $set: { token: response.token, refreshToken: response.refreshToken } })
            } else {
                var accToken = new userToken({
                    email: (req.body.email).toLowerCase(),
                    token: response.token,
                    refreshToken: response.refreshToken
                });
                var result = accToken.save();
            }
        }).exec();

        res.cookie('x-token', response.token, {maxAge: 6000000});
        // res.cookie('uid', account._id, {maxAge: 6000000})
        // res.cookie('uemail', account.email, {maxAge: 6000000})
        res.cookie('x-refresh-token', response.refreshToken, {maxAge: 6000000});

        req.session.User = {
            email: account['email'],
            fname: account['fname'],
            lname: account['lname'],
            id : account['_id']
        }

        req.session.save(function(err) {
            // session saved
            if(!err) {
                //Data get lost here
                res.redirect("/");
            }
          })
        // return res.status(200).json({status: 'success'})
        // res.redirect('/');
        // setTimeout(() => res.redirect('/'), 1000)


    } catch (err) {
        res.status(500).send(err);
    }
});



router.get("/", function(req, res) {
    // console.log(req.decoded['email'])
    // console.log(req.session.User)
    // console.log(req.cookies)
    // if(req.session.User == null){
    //     res.render('index', {
    //         user: null
    //     })
    // }else{
    //     const uemail = req.session.User['email'];
    //     res.render('index', {
    //         user: uemail 
    //     })
    // }

    // if(req.cookies['x-token'] == null){
    //     res.render('index', {
    //         user: null
    //     })
    // }
    if(req.session.User == null){
        res.render('index', {
            user: null
        })
    }else{
        // const uemail = req.cookies.id['email'];
        res.render('index', {
            user: req.session.User['email']
        })
    }

    // if(req.decoded == null){
    //     res.render('index', {
    //         user: req.decoded['email']
    //     })
    // }else{
    //     res.render('index',{
    //         user: null
    //     })
    // }
});

router.get('/danvvgky', async(req, res)=>{
    res.render("product/registerPage");
})

router.get('/account', TokenUserCheckMiddleware, async( req, res) =>{
    // console.log(req.session.User)
    // console.log(req.cookies)
    // if(req.session.User == null){
    //     res.render("product/registerPage");
    // }else{
    //     console.log(req.session.User);
    //     const uemail = req.session.User['email'];

    //     var check = Account.findOne({email: uemail})
    //     // console.log(check);
    //     res.render('product/accountPage', {
    //         user: check.email
    //     }) 
    // }                                             
    console.log(req.cookies['uemail'])
    if(req.cookies['x-token'] == null){
        res.render("product/registerPage");
    }else{
        console.log(req.decoded)
        // console.log(req.session.User);
        // const uemail = req.session.User['email'];
        var account = await Account.findOne({email: req.decoded['email']}).exec();
        // console.log(account);
        // console.log(account.fname)
        res.render('product/accountPage', {
            user: account
        }) 
    }
})

router.get('/chucnang', async(req, res)=>{
    console.log(req.session.User)
    res.render('product/accountPage');

    
})

router.get('/address', async(req, res)=>{
    // res.render('product/addressPage');

    if(!req.session.User){
        res.redirect('/')
    }else{
        console.log(req.session.User['email']);
        Account.find({email: req.session.User['email']}, function(err, docs){
            console.log(docs);
            var address = docs[0].shipping_at;
            // console.log(docs[0].shipping_at);
            console.log(address)
            if(address == null || address == "undefined" ){
                console.log(1)
                res.render('product/addressPage', {
                    "listAddress": null
                })
            }else{
                console.log(2)
                res.render('product/addressPage',{
                    "listAddress": docs
                })
            }
        })
        // var address = await Account.findOne({email: req.session.User['email']}).exec();
        // console.log(address);
       
        // console.log(address.shipping_at.length);
        // console.log(JSON.stringify(address))
        // var addressL = address.shipping_at.length;
        // var toJson = JSON.stringify(address)
        // if(addressL = 0){
        //     console.log(1)
        //     res.render('product/addressPage', {
        //         "listAddress": null
        //     })
        // }else{
        //     console.log(2)
        //     res.render('product/addressPage',{
        //         "listAddress": await toJson
        //     })
        // }

    }
    
})

router.get('/proxygb', (req, res)=>{
    // if(req.session.User == null){
    //     res.render("product/proxyPage");
    // }else{
        // console.log(req.session.User);
        Category.find({}, function(err, docs) {
            console.log(docs);
            res.render("product/proxyPage", {
                "listCategory": docs
            });
        });
        
        
        // const uemail = req.session.User['email'];
        // res.render('index', {
        //     user: uemail 
        // })
    // }
})

router.post('/captcha', async(req, res)=>{
    
});

router.post("/account", async (req, res, next) => {


    // console.log(req);
    // console.log(req.body.fileuploader-list-picture);
    console.log(req.body);
    try {
        var check = await Account.find({ email: req.body.email }, async (err, docs) => {
            console.log(check);
            if (docs.length) {
                res.status(400).json({
                    code: 400,
                    message: "email already exists"
                })
            } else {
                // if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null){
                //     return res.json({"responseError": "Please select captcha first"});
                // }

                // const secretKey = config.secretKey;
                
                // const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress
            
                // request(verificationURL, function(error, response, body){
                //     body = JSON.parse(body);
                //     if(body.success !== undefined && !body.success){
                //         return res.json({"responseError": "Failed captcha verification"});
                //     }
                //     res.json({"responseSuccess": "Success"});
                // });

                req.body.password = bcrypt.hashSync(req.body.password, 10);
                var account = await new Account({
                    fname: req.body.fname,
                    lname: req.body.lname,
                    email: (req.body.email),
                    password: req.body.password,
                    active: false
                });
                var result = account.save();


                const user = {
                    "email": (req.body.email),
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


                var checkToken = userToken.find({ email: req.body.email }, async (err, docs) => {
                    if (docs.length) {
                        // userToken.set(req.body);
                        // db.collection('usertokens').updateOne({ email: req.body.email }, { $set: { token: response.token, refreshToken: response.refreshToken } })
                    } else {
                        var accToken = new userToken({
                            email: (req.body.email),
                            token: response.token,
                            refreshToken: response.refreshToken
                        });
                        var result = accToken.save();
                    }
                }).exec();


                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'noobassembly@gmail.com',
                        pass: '123456Ban'
                    }
                });
                var link = "http://"+req.get('host')+"/verify?id="+response.token
                var mainOptions = {
                    from: 'NoobTeam',
                    to: (req.body.email),
                    subject: 'Active account',
                    text: 'You received mess from ' + (req.body.email),
                    html: '<p style="font-size: 32px;line-heigth: 18px;border-bottom: 1px solid silver"><b>Thanks for your register!!!</b><p><a href='+link+'>Click here to active your account</a></p>'
                }

                transporter.sendMail(mainOptions, function(err, info) {
                    console.log(info)
                    if (err) {
                        console.log(err);
                        res.redirect('/');
                    } else {
                        console.log('Mess sent: ' + info.response);
                        res.redirect('/');
                    }
                })
                // res.send(result);

                // res.redirect('/');
            }
        }).exec();
    } catch (err) {
        res.status(500).send(err)
    }
})



router.get('/get_session', (req, res) => {
    //check session
    if(req.session.User){
        return res.status(200).json({status: 'success', session: req.session.User})
    }
    return res.status(200).json({status: 'error', session: 'No session', code: 200})
})

router.get('/get_noti', TokenUserCheckMiddleware, async(req, res)=>{
    // console.log(req.session.User);
    // console.log(req.decoded);
    var account = await Account.findOne({email: req.decoded['email']}).exec();
    // console.log(account)
    return res.status(200).json({
        status: 'success',
        noti : {
          get_noti:  account.get_noti
        }
    })
});

router.get('/get_cookie' ,async(req, res) =>{
    
        if(req.cookies['x-token'] && req.session.User){
        var account = await Account.findOne({email: req.session.User['email']}).exec();
        // console.log(account)
        return res.status(200).json({
            status: 'success',
            session: {
                id : account._id,
                email: account.email,
                fname: account.fname,
                lname: account.lname
            }
        })
    }
    return res.status(200).json({status: 'error', session: 'No session', code: 200})
})

router.get('/clear_session', (req, res)=>{

    req.session.destroy(function(err){
        return res.status(200).json({status: 'success', session: 'cannot access session here'})
    })
})

router.get('/verify', async(req, res) =>{
    console.log(req.query['id']);
    try{
        var checkToken = await userToken.findOne({token: req.query['id']}).exec();
        var checkActive = await Account.findOne({email: checkToken['email']})
        console.log(checkToken);
        console.log(checkActive)
        if(checkToken && checkActive['active'] == false){
            db.collection('accounts').updateOne({ email: (checkToken['email']).toLowerCase() }, { $set: { active: true } })

            res.redirect('/');
        }else{
            res.redirect('/');
        }
    }catch(err){
        res.status(500).send(err);
    }
});

router.post('/updateaccount', TokenUserCheckMiddleware ,async(req, res)=>{
    // const uemail = req.session.User['email'];
    console.log(req.body)
    const uemail = req.decoded['email']
    console.log(uemail);
    try{
        
        var account = await Account.findOne({ email: uemail }).exec();

        // console.log(account)

        // console.log(account.shipping_at);
        console.log(account.shipping_at[0]);
        // console.log(account.shipping_at[0].address);
        console.log(account.shipping_at[0]['address'])
        // console.log(account.shipping_at[0].address)
        if(!account){
            return res.status(400).send({
                status: "error",
                message: "The user does not exist "
            });
        }

        

       

        // if(req.body.currentpw == '' & req.body.newpw == ''){
        //     db.collection('accounts').updateOne({ 
        //         email: uemail 
        //     }, 
        //         { $set: 
        //             { 
        //                 fname: req.body.fname, 
        //                 lname: req.body.lname,
        //                 birth_date: req.body.dob,
        //                 paypal: req.body.paypal,
        //                 fb_url: req.body.fburl,
        //                 // shipping_at:[{
        //                 //     address: req.body.address,
        //                 //     city: req.body.city,
        //                 //     zip_code: req.body.zipcode
        //                 // }
        //                 // phone_area_code: req.body.phonearea,
        //                 phone_number: req.body.pnumber,
        //                 get_noti: req.body.get_noti
                            
                        
        //             } 
        //         })

        //         // res.status(200).status('ok')
        //         res.redirect('/account');
        // }else{
        //      if (!bcrypt.compareSync(req.body.currentpw, account.password)) {
        //         return res.status(400).send({
        //             status: "error",
        //             message: "The password is not correct"
        //         });
        //     }
        //     req.body.newpw = bcrypt.hashSync(req.body.newpw, 10);
        //     account.set({ password: req.body.newpw });
        //     var result = await account.save();
        //     // res.send(result)
        //     res.redirect('/account')

        // }

        

    }catch(err){
        res.status(500).send(err);
    }

})

// ------------------------------------------ ADDRESS CONFIG-------------------------------------

router.post('/addaddress', TokenUserCheckMiddleware, async(req, res)=>{

    var uemail = req.decoded['email'];
    console.log(uemail)
    try{
        db.collection('accounts').update({
            email: uemail
        },{
            $addToSet: {
                shipping_at:{
                    _id: (new mongoose.Types.ObjectId()).toString(),
                    lname: req.body.lname,
                    fname: req.body.fname,
                    cname: req.body.cname,
                    email: (req.body.email).toLowerCase(),
                    phone_number: req.body.pnumber,
                    address: req.body.address,
                    city: req.body.country,
                    town_city: req.body.towncity,
                    zip_code: req.body.postcode
                }
            }
        })
        // res.status(200).status('ok')
        res.redirect('/address')
       
    }catch(err){
        res.status(500).send(err);
    }
})



router.delete('/delete-address/:id' , async(req, res)=>{
    // console.log(req.decoded['email']);
    var uemail = "rapsunl231@gmail.com"
    console.log(req.params.id)
    try{
        var address = db.collection('accounts').update(
            {
                'email': uemail
            },{
                "$pull": {
                    "shipping_at":{
                        "_id": req.params.id
                    }
                }
            });

        res.send(address);
        
    }catch(err){
        res.status(500).send(err);
    }
})

// ---------------------------------------------------------------------------------------------

router.post('/updatepassword', async (req, res) => {
    // console.log(req.body);
    const uemail = req.cookies['x-email'];
    // console.log(uemail)
    try {
        var account = await Account.findOne({ email: uemail }).exec();
        // console.log(account);
        if (!bcrypt.compareSync(req.body.currentpw, account.password)) {
            return res.status(400).send({
                status: "error",
                message: "The password is not correct"
            });
        }
        req.body.newpw = bcrypt.hashSync(req.body.newpw, 10);
        account.set({ password: req.body.newpw });
        var result = await account.save();
        res.send(result)

    } catch (err) {
        res.status(500).send(err);

    }
})

router.post('/history', async(req, res)=>{
    try{
        var account = await Account.findOne({_id: req.body.id}).exec();
        console.log(account);
        var checkTracking = await Tracking.find({email: account['email']}).exec();
        console.log(checkTracking);
        res.send(checkTracking);

    }catch(err){
        res.status(500).send(err);
    }
})

router.post('/joingb', async(req, res)=>{
    try{
        var account = await Account.findOne({email: req.body.email}).exec();
        console.log(account);
        

    }catch(err){
        res.status(500).send(err);
    }
})

// --------------------------------- PRODUCT CONFIG --------------------------------------------
router.get('/proxygb/product/:id', async(req, res)=>{

    try{

    }catch(err){
        res.status(400).send(err);
    }
})
// ---------------------------------------------------------------------------------------------

router.get('*',function(req, res){
    res.status(404).render('404Page')
})



module.exports = router;