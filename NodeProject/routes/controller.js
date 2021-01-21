const express = require('express');
const router = express.Router();
const req = require('request');
const bcrypt = require("bcryptjs");
const fs = require('fs');
const readline = require('readline');
const path = require('path')
const jwt = require('jsonwebtoken');
const reqHeader = require('request');
const config = require('./../lib/comon/config');
const utils = require('./../lib/comon/utils');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const fileuploader = require('./../lib/fileuploader/fileuploader');
router.use(cookieParser());
const app = express();
const i18n = require("i18n")
const moment = require("moment")

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

const adsProductStorage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null, 'docs/pimg/portfolio/gallery/')
    },
    filename: function(req, file,cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})

const eventProductStorage = multer.diskStorage({
    destination: function(req, file,cb){
        cb(null, 'docs/pimg/eventproduct/')
    },
    filename: function(req, file,cb){
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname)
    }
})
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
        fileSize: 1024 * 1024 * 1000
    },
    // fileFilter: fileFilter
});

const uploadAdsProduct = multer({
    storage: adsProductStorage,
    limits:{
        fileSize: 1024 * 1024 * 1000
    }
})

const uploadEventProduct = multer({
    storage: eventProductStorage,
    limits:{
        fileSize: 1024 * 1024 * 1000
    }
})

i18n.configure({
    locales:['en', 'vi'],
    defaultLocale: 'en',
    directory: path.join(__dirname, '/locales'),
    autoReload: true,
    cookie: 'lang',
    api: {
        __: '__', //now req.__ becomes req.__
        __n: '__n', //and req.__n can be called as req.__n
      },
})
router.use(i18n.init);
app.use((req, res, next) => {
  res.cookie('lang', req.params.lang, {maxAge: 900000});
  next();
});
// router.use(function(req, res, next){
//     if (req.cookies.locale === undefined) {
//         res.cookie('locale', 'zh', { maxAge: 900000, httpOnly: true });
//         req.setLocale('zh');
//     }
//     next();
// })

// var imgPath = 'docs/img_1435.JPG';
var Account = require('./../db/model/account');
var AdmAccount = require('./../db/model/accadmin');
var Product = require('./../db/model/product');
var Couter = require('./../db/model/couter')
var Category = require('./../db/model/category');
var AdsProduct = require('./../db/model/adsproduct');
var EventProduct = require('./../db/model/eventproduct');
var PageContent = require('./../db/model/mainpage_content');
var Image = require('./../db/model/image');
var userToken = require('./../db/model/token');
var TokenCheckMiddleware = require('./../lib/check/checktoken');
// example = require('./../lib/js/listAccount.js')


const options = {

    url: 'http://localhost:5000/profile',
    method: 'GET',
    headers: {
        'x-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZEBnbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMzQ1NiIsImlhdCI6MTU3NjA2MDk2NSwiZXhwIjoxNTc2MDYxMDI1fQ.obUYFFsvscovK0uq5o-PX3OCNP7a0NOdGqrNqm0KBFs'
    }
};


router.get('/change-lang/:lang', (req, res)=>{
    console.log(req.params.lang)
    res.cookie('lang', req.params.lang, {maxAge: 900000});
    res.redirect('back');
})

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

// router.get("/nhomepage", function(req, res) {
//     res.render("manager/adminPage");
// });

router.get("/test", function(req, res) {
    res.render("testPage");
});

router.get("/signup", function(req, res) {
    res.render("registerPage");
});

router.get('/', TokenCheckMiddleware, function(req, res) {
    // if (!req.session.Admin) {
    //     res.redirect('/api/signin')
    // } else {
        // var admin = req.session.Admin
        res.render('manager/adminPage', {
            fname: req.decoded['fname'],
            lname: req.decoded['lname'],
            mail: req.decoded['email'],
            lang: req.cookies.lang
        });
    

});

router.get('/messenger', TokenCheckMiddleware, function(req, res) {
    res.render('messengerPage');
})

router.get('/list-room', TokenCheckMiddleware, function(req, res) {
    res.render('listroomPage');
})

router.get('/listcreated', function(req, res) {
    res.render('listCreated', {
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

router.get('/list',TokenCheckMiddleware, function(req, res) {
    // Couter.find({}, function(err, docs) {
    //     console.log(docs);

    // });
    try{
        Account.find({}, function(err, docs) {
            console.log(docs);
            res.render('listAccount', {
                "listAccount": docs
            });
            res.status(200)
        });

    }catch(err){
        res.status(400).send(err);
    }
    
  
    

});

router.delete('/delete/:id', async (req, res) => {
    try {
        var result = await AdmAccount.deleteOne({ _id: req.params.id }).exec();
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
        var account = await Account.findById(req.params
            .id).exec();
        account.set(req.body);
        var result = await account.save();
        res.send(result);

    } catch (err) {
        res.status(200).send(err);
    }
});
/*-----------------------------------------------*/
// load db on form

const accountController = require('./controller/account');
const productController = require('./controller/product');
const categoryController = require('./controller/category');
const adsProductController = require('./controller/adsproduct');
const eventProductController = require('./controller/eventproduct');
const contentController = require('./controller/content');

router.get("/account/edit/:id", accountController.editGet);
// update db to mongo
router.post("/account/edit/:id", upload.single('picture'), accountController.editPost);

router.post("/login", accountController.login);

router.post("/register", upload.single('picture'), accountController.register)

router.post('/refresh_token', accountController.refresh_token);


router.get('/profile', TokenCheckMiddleware, accountController.profile)


router.post("/created", accountController.created);



router.get('/product',TokenCheckMiddleware, productController.product)

router.get('/product/getpid/:id', productController.getpid)

router.get('/product/getcid/:id', productController.getcid)
router.get('/product/add', productController.addGet)

router.post('/product/add', upload.single('picture'), productController.addPost)

router.get('/product/edit/:id', productController.editGet)

router.post("/product/edit/:id", upload.single('picture'), productController.editPost);
// product have been deleted when deleting category
router.delete('/product/delete/:id', productController.Delete);

router.get('/category', categoryController.category)

router.get('/mounting', categoryController.mounting)

router.get('/category/add', categoryController.addGet)




// upload.single('picture'),'

router.post('/category/add', upload.single('picture'), categoryController.addPost)

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

router.get('/category/edit/:id', categoryController.editGet)

router.get('/category/get/:id', categoryController.get)

router.get('/category/getcid/:id', categoryController.getcid)

router.post("/category/edit/:id", upload.single('picture'), categoryController.editPost);
// product have been deleted when deleting category
router.delete('/category/delete/:id', categoryController.Delete);

// Get list Ads Product
router.get('/adsproduct', adsProductController.adsproduct)
router.get('/adsproduct/add', adsProductController.addGet)

router.post('/adsproduct/add', uploadAdsProduct.single('picture'), adsProductController.addPost)

router.get('/adsproduct/edit/:id', adsProductController.editGet)

router.post('/adsproduct/edit/:id', uploadAdsProduct.single('picture'), adsProductController.editPost)

router.get('/adsproduct/get/:id', adsProductController.get)

router.delete('/adsproduct/delete/:id', adsProductController.Delete);

// Event Product
router.get('/eventproduct', TokenCheckMiddleware, eventProductController.eventproduct)
router.get('/eventproduct/add',TokenCheckMiddleware, eventProductController.addGet)

router.post('/eventproduct/add', uploadAdsProduct.single('picture'), eventProductController.addPost)

router.get('/eventproduct/edit/:id', TokenCheckMiddleware, eventProductController.editGet)

router.get('/eventproduct/get/:id', TokenCheckMiddleware, eventProductController.get)

router.post('/eventproduct/edit/:id', uploadEventProduct.single('picture'), eventProductController.editPost)


router.delete('/eventproduct/delete/:id', eventProductController.Delete);


// Content Page

router.get('/oldcontent', contentController.oldcontent)

router.get('/content', TokenCheckMiddleware, contentController.content)
router.get('/content/add', TokenCheckMiddleware, contentController.addGet)
router.post('/content/add', contentController.addPost)
router.get('/content/edit/:id', contentController.editGet)
router.get('/content/get/:id', contentController.get)
router.post('/content/edit/:id', contentController.editPost)

module.exports = router;