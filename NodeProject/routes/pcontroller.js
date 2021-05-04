const express = require('express');
const router = express.Router();
const request = require('request');
const bcrypt = require("bcryptjs");
const fs = require('fs');
const readline = require('readline');
const jwt = require('jsonwebtoken');
const path = require('path')
const reqHeader = require('request');
const nodemailer = require('nodemailer');
const config = require('./../lib/comon/config');
const utils = require('./../lib/comon/utils');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const livereload = require('connect-livereload');
const moment = require('moment');
const https = require('https');
const http = require('http');
const app = express();
router.use(cookieParser());
const i18n = require("i18n")
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
var Product = require('./../db/model/product');
var AdsProduct = require('./../db/model/adsproduct');
var EventProduct = require('./../db/model/eventproduct')
var PageContent = require('./../db/model/mainpage_content');
var Category = require('./../db/model/category')
var Couter = require('./../db/model/couter')
var TokenCheckMiddleware = require('./../lib/check/checktoken');
var TokenUserCheckMiddleware = require('./../lib/check/checktokenproduct.js')
var SessionCheckMiddleware = require('./../lib/check/checksession');
var CountMiddleware = require('./../lib/check/countproduct');


// i18n.configure({
//     locales:['en', 'vi'],
//     directory: __dirname + '/locales',
//     cookie: 'lang',
// })

app.use(session({
    saveUninitialized: true,
    name: "mycookie",
    resave: true,
    secret: config.secret,
    cookie: {
        secure: false,
        maxAge: 1800000
    }
}));

app.use('/change-lang/:lang', (req, res) => {
    console.log(req.params.lang)
    res.cookie('lang', req.params.lang, { maxAge: 900000 });
    res.redirect('back');
})

// app.use(livereload())

router.post("/login", async (req, res, next) => {
    res.cookie('lang', 'en', { maxAge: 900000 });
    console.log(req.ip);
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
                    refreshToken: response.refreshToken,
                    ip: req.ip
                });
                var result = accToken.save();
            }
        }).exec();

        res.cookie('x-token', response.token, { maxAge: 6000000 });
        // res.cookie('uid', account._id, {maxAge: 6000000})
        // res.cookie('uemail', account.email, {maxAge: 6000000})
        res.cookie('x-refresh-token', response.refreshToken, { maxAge: 6000000 });
        res.cookie('lang', 'vi', { maxAge: 900000 });
        req.session.User = {
            email: account['email'],
            fname: account['fname'],
            lname: account['lname'],
            id: account['_id']
        }

        req.session.save(function(err) {
            // session saved
            if (!err) {
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
    var getName, getId;
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




    AdsProduct.find({}, function(err, docs) {
        PageContent.find({}, function(ContentErr, ContentDocs) {
            EventProduct.find({ status: 1 }, function(EProductErr, EProductDocs) {
                EventProduct.findOne({}, function(errOne, eProductData){
                    getId = eProductData.event_product_name
                    Category.findOne({category_id: getId}, function(errTwo, getNameCategoryData){

                        getName = getNameCategoryData.category_name
                        if(EProductDocs.length > 0){
                            EProductDocs.forEach(function(item) {
                                var imgUrl = item.event_product_image.path
                                var replaceIcon = imgUrl.replace(/\\/g, "/");
                                var imgBg = 'api/' + replaceIcon

                                console.log(replaceIcon)
                                if (req.session.User == null) {
                                    res.render('index', {
                                        user: null,
                                        listAdsProduct: docs,
                                        listContent: ContentDocs,
                                        EventProduct: EProductDocs,
                                        images: imgBg,
                                        date_start: item.date_start,
                                        nameEventProduct: getName
                                    })
                                } else {
                                    Account.findOne({email:req.session.User['email']}, function(errAccount, getAccount){
                                        console.log(getAccount)
                                        res.render('index', {
                                            user: req.session.User['email'],
                                            userName: getAccount.fname + ' ' + getAccount.lname,
                                            listAdsProduct: docs,
                                            listContent: ContentDocs,
                                            EventProduct: EProductDocs,
                                            images: imgBg,
                                            date_start: item.date_start,
                                            nameEventProduct: getName
                                        })
                                    })
                                }
                            })

                        }else{
                            if (req.session.User == null) {
                                res.render('index', {
                                    user: null,
                                    listAdsProduct: docs,
                                    listContent: ContentDocs,
                                    EventProduct: [],
                                })
                            } else {
                                res.render('index', {
                                    user: req.session.User['email'],
                                    listAdsProduct: docs,
                                    listContent: ContentDocs,
                                    EventProduct: [],
                                })
                            }
                        }
                    })
                })
                
            })
        })
    }).limit(5)


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

router.get("/time_event", function(req, res) {
    EventProduct.find({ status: 1 }, function(EProductErr, EProductDocs) {
        EProductDocs.forEach(function(item) {
            res.send(item.date_end);
        })
    })
})

router.get('/register', async (req, res) => {
    res.render("product/registerPage",{
        currentPage: "Login"
    });
})

router.get('/account', TokenUserCheckMiddleware, async (req, res) => {
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
    if (req.cookies['x-token'] == null) {
        res.render("product/registerPage");
    } else {
        console.log(req.decoded)
        // console.log(req.session.User);
        // const uemail = req.session.User['email'];
        var account = await Account.findOne({ email: req.decoded['email'] }).exec();
        // console.log(account);
        // console.log(account.fname)
        res.render('product/accountPage', {
            user: account
        })
    }
})

router.get('/chucnang', async (req, res) => {
    console.log(req.session.User)
    res.render('product/accountPage');


})

router.get('/account/address', async (req, res) => {
    // res.render('product/addressPage');

    if (!req.session.User) {
        res.redirect('/')
    } else {
        console.log(req.session.User['email']);
        Account.find({ email: req.session.User['email'] }, function(err, docs) {
            console.log(docs);
            var address = docs[0].shipping_at;
            // console.log(docs[0].shipping_at);
            console.log(address)
            if (address == null || address == "undefined") {
                console.log(1)
                res.render('product/addressPage', {
                    "listAddress": null
                })
            } else {
                console.log(2)
                res.render('product/addressPage', {
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

router.get('/shop', (req, res) => {
    // if(req.session.User == null){
    //     res.render("product/proxyPage");
    // }else{
    // console.log(req.session.User);
    Category.find({}, function(err, docs) {
        Product.find({}, function(err, pData){
            EventProduct.findOne({}, function(err, epData){
                // console.log(epData)
                res.render("product/proxyPage", {
                    "listCategory": docs,
                    "listProduct": pData,
                    ePID: epData.event_product_name,
                    currentPage:  "Shop",
                });
            })
        })
    });
    // const uemail = req.session.User['email'];
    // res.render('index', {
    //     user: uemail 
    // })
    // }
})

router.get('/getshop', (req, res) => {
    Category.find({}, function(err, docs) {
        Product.find({}, function(err, pData){
            EventProduct.findOne({}, function(err, epData){
                res.send({
                    "listCategory": docs,
                    "listProduct": pData,
                    ePID: epData.event_product_name,
                }).status(200);
            })
        })
    });
})

router.post('/captcha', async (req, res) => {

});

router.post("/account", async (req, res, next) => {
    try {
        var check = await Account.find({ email: req.body.email }, async (err, docs) => {

            if (req.body.email == config.admin || req.body.email == config.mod) {
                return res.status(400).send({
                    code: 400,
                    message: "email already exits!!"
                })
            }
            // if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null){
            //         return res.status(400).sned({
            //             code: 400,
            //             message: "Please select captcha first"
            //         });
            // }

            if (docs.length) {
                // res.status(400).json({
                //     code: 400,
                //     message: "email already exists"
                // })
                return res.status(400).send({
                    code: 400,
                    message: "email already exits!!"
                })
            } else {
                // if(req.body.password !== req.body.re_password){
                //     return res.status(400).send({
                //         code: 400,
                //         message: "Confirm Password is not math with Password"
                //     })
                // }

                // if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null){
                //     return res.status(400).sned({
                //         code: 400,
                //         message: "Please select captcha first"
                //     });
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
                console.log(account)

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
                        pass: 'gsrfewqfnplyltcz'
                    }
                });
                var link = "https://" + req.get('host') + "/verify?id=" + response.token;
                var logo = "https://"+ req.get('host') + "/favicon/big_logo.png";
                var mainOptions = {
                    from: 'NoobStore <noobassembly@gmail.com>',
                    to: (req.body.email),
                    subject: '[NoobStore] Please verify your email address',
                    text: 'You received message from ' + (req.body.email),
                    html: "<img scr='"+logo+"' width='150' height='70'/><br><br><p style='font-family: 'Montserrat', sans-serif;font-weight: 600;font-size:18px'>Hi <b>"+req.body.lname+"</b>,</p><br><p>We're happy you signed up for NoobStore.To finish registration, please confirm your email address.</p><br><p><div><a style='background: #007bff;padding: 9px;width: 200px;color: #fff;text-decoration: none;display: inline-block;font-weight: bold;text-align: center;letter-spacing: 0.5px;border-radius: 50px;' href=" + link + ">Verify now</a></div><br><br><p>Welcome to NoobStore!<br>The Noob Team</p><br><br><br><p>Once verified, you can join and get notification from NoobStore. If you have any problems, please contact us: noobassembly@gmail.com</p></p>"
                }

                transporter.sendMail(mainOptions, function(err, info) {
                    console.log(info)
                    if (err) {
                        // console.log(err);
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
    if (req.session.User) {
        return res.status(200).json({ status: 'success', session: req.session.User })
    }
    return res.status(200).json({ status: 'error', session: 'No session', code: 200 })
})

router.get('/get_noti', TokenUserCheckMiddleware, async (req, res) => {
    // console.log(req.session.User);
    // console.log(req.decoded);
    var account = await Account.findOne({ email: req.decoded['email'] }).exec();
    // console.log(account)
    return res.status(200).json({
        status: 'success',
        noti: {
            get_noti: account.get_noti
        }
    })
});

router.get('/get_cookie', async (req, res) => {

    if (req.cookies['x-token'] && req.session.User) {
        var account = await Account.findOne({ email: req.session.User['email'] }).exec();
        // console.log(account)
        return res.status(200).json({
            status: 'success',
            session: {
                id: account._id,
                email: account.email,
                fname: account.fname,
                lname: account.lname
            }
        })
    }
    return res.status(200).json({ status: 'error', session: 'No session', code: 200 })
})

router.get('/clear_session', (req, res) => {

    req.session.destroy(function(err) {
        return res.status(200).json({ status: 'success', session: 'cannot access session here' })
    })
})

router.get('/verify', async (req, res) => {
    console.log(req.query['id']);
    var getTimeActive = new Date();
    console.log(getTimeActive)
    try {
        var checkToken = await userToken.findOne({ token: req.query['id'] }).exec();
        var checkActive = await Account.findOne({ email: checkToken['email'] })
        console.log(checkToken);
        console.log(checkActive)
        if (checkToken && checkActive['active'] == false) {
            db.collection('accounts').updateOne({ email: (checkToken['email']).toLowerCase() }, { $set: { active: true, actived_date: getTimeActive } })

            res.redirect('/');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post('/updateaccount', TokenUserCheckMiddleware, async (req, res) => {
    // const uemail = req.session.User['email'];
    console.log(req.body)
    const uemail = req.decoded['email']
    console.log(uemail);
    try {

        var account = await Account.findOne({ email: uemail }).exec();

        // console.log(account)

        // console.log(account.shipping_at[0]);
        // console.log(account.shipping_at[0]['address'])
        if (!account) {
            return res.status(400).send({
                status: "error",
                message: "The user does not exist "
            });
        }





        if (req.body.currentpw == '' & req.body.newpw == '') {
            db.collection('accounts').updateOne({
                email: uemail
            }, {
                $set: {
                    fname: req.body.fname,
                    lname: req.body.lname,
                    birth_date: req.body.dob,
                    paypal: req.body.paypal,
                    fb_url: req.body.fburl,
                    // shipping_at:[{
                    //     address: req.body.address,
                    //     city: req.body.city,
                    //     zip_code: req.body.zipcode
                    // }
                    // phone_area_code: req.body.phonearea,
                    phone_number: req.body.pnumber,
                    get_noti: req.body.get_noti


                }
            })

            // res.status(200).status('ok')
            res.redirect('/account');
        } else {
            if (!bcrypt.compareSync(req.body.currentpw, account.password)) {
                return res.status(400).send({
                    status: "error",
                    message: "The password is not correct"
                });
            }
            req.body.newpw = bcrypt.hashSync(req.body.newpw, 10);
            account.set({ password: req.body.newpw });
            var result = await account.save();
            // res.send(result)
            res.redirect('/account')

        }



    } catch (err) {
        res.status(500).send(err);
    }

})

// ------------------------------------------ ADDRESS CONFIG-------------------------------------

router.post('/account/addaddress', TokenUserCheckMiddleware, async (req, res) => {

    var uemail = req.decoded['email'];
    console.log(uemail)
    try {
        db.collection('accounts').update({
            email: uemail
        }, {
            $addToSet: {
                shipping_at: {
                    _id: (new mongoose.Types.ObjectId()).toString(),
                    lname: req.body.lname,
                    fname: req.body.fname,
                    cname: req.body.cname,
                    email: (req.body.email).toLowerCase(),
                    phone_number: req.body.pnumber,
                    address: req.body.address,
                    country: req.body.country,
                    town_city: req.body.towncity,
                    zip_code: req.body.postcode
                }
            }
        })
        // res.status(200).status('ok')
        res.redirect('/account/address')

    } catch (err) {
        res.status(500).send(err);
    }
})



router.delete('/delete-address/:id', async (req, res) => {
    // console.log(req.decoded['email']);
    var uemail = "rapsunl231@gmail.com"
    // console.log(req.params.id)
    try {
        var address = db.collection('accounts').update({
            'email': uemail
        }, {
            "$pull": {
                "shipping_at": {
                    "_id": req.params.id
                }
            }
        });

        res.send(address);

    } catch (err) {
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


router.get('/account/tracking', function(req, res) {
    var email = 'rapsunl231@gmail.com'
    try {
        Tracking.find({ email: email }, function(err, docs) {
            console.log(docs);
            res.render('product/trackingPage', {
                'listTracking': docs
            })
        })
    } catch (err) {
        res.status(400).send(err);
    }
})

router.get('/order/:id', function(req, res) {
    try {

    } catch (err) {
        res.status(400).send(err);
    }
})


router.post('/history', async (req, res) => {
    try {
        var account = await Account.findOne({ _id: req.body.id }).exec();
        console.log(account);
        var checkTracking = await Tracking.find({ email: account['email'] }).exec();
        console.log(checkTracking);
        res.send(checkTracking);

    } catch (err) {
        res.status(500).send(err);
    }
})

router.post('/shop/payment/joingb', TokenUserCheckMiddleware, async (req, res) => {
    console.log(req.body)
    // console.log(req.decoded);
    var uemail = req.decoded['email']
    try {
        var account = await Account.findOne({ email: uemail }).exec();
        var checkProduct = await Product.find({ product_id: req.body.product_id }, { "category_id": "ETC2" }).exec();
        // var checkProduct = await Product.find({product_id: {"$all": req.body.product_id}}, 


        console.log(checkProduct)

        // var checkProduct = db.collection('products').aggregate([
        //     {$math: {product_id: "SWPACK3"} },
        //     {$count: "total"}
        // ])
        // console.log(checkProduct)
        await Couter.findOne({ _id: 'tracking' }, function(err, docs) {
            console.log('incc = ' + docs['seq'])

            // for(var i=0;i<checkProduct.length;i++){
            //     (function(i){

            // Object.keys(req.body.quantity).forEach(function(key){  


            // if(b.indexOf(checkProduct[key].product_name)){

            // }else{
            //     b.push(checkProduct[key].product_name);
            // }

            // console.log(req.body.product_id);
            // console.log(checkProduct[key].product_name)
            db.collection('trackings').insertOne({
                order_id: "ORD00" + (docs['seq'] + 1),
                email: uemail,
                list_product: {
                    _id: (new mongoose.Types.ObjectId()).toString(),
                    product_id: req.body.product_id,
                    product_name: req.body.productName,
                    product_quantity: req.body.quantity,
                    product_price: req.body.price,
                    // product_picture: checkProduct[key].pic_product['path']
                },
                payment: req.body.payment,
                shipping_at: {
                    customer_name: req.body.customer_name,
                    customer_city: req.body.customer_city,
                    customer_phone: req.body.customer_phone,
                    customer_address: req.body.customer_address,
                    customer_country: req.body.customer_country,
                    customer_postal_code: req.body.customer_postal_code,
                },
                // total: totalPrice
            })
            //     })(i);
            // }
            // )
            // }
            db.collection("couters").findAndModify({
                    _id: "tracking"
                }, {}, { $inc: { "seq": 1 } }, { new: true, upsert: true },

                function(err, docs) {
                    console.log(docs);
                })
        })
    } catch (err) {
        res.status(500).send(err);
    }
})

// --------------------------------- PRODUCT CONFIG --------------------------------------------
router.get('/shop/product/:id', async (req, res) => {
    console.log(req.params.id);
    try {
        Product.find({ category_url_name: req.params.id }, function(err, docs) {
            // console.log(docs);
            if (docs[0]) {
                Category.findOne({ category_id: docs[0].category_id }, function(err, docs2) {

                    // console.log(docs);
                    // console.log(docs2);
                    res.render('product/detailsProductPage', {
                        title: 'aaaa',
                        "detailsProduct": docs,
                        "Category": docs2,
                        currentPage:  "Shop",
                    })
                })

            } else {
                res.redirect('/404Page')
            }
        })
    } catch (err) {
        res.status(400).send(err);
    }
})

router.get('/shop/payment/:id', TokenUserCheckMiddleware, async (req, res) => {
    console.log(req.params.id)
    // console.log(req.decoded['email']);
    try {
        // Product.find({ category_id: req.params.id }, function(errdocs, docs) {
        Product.find({ category_url_name: req.params.id }, function(errdocs, docs) {
            if (docs[0]) {
                Category.findOne({ category_id: docs[0].category_id }, function(errdocs2, docs2) {
                    Account.findOne({ email: req.decoded['email'] }, function(erruser, docs3) {
                        // console.log(user)

                        // console.log(docs);
                        // console.log(docs2);
                        res.render('product/joingbPage', {
                            title: 'Payment',
                            "User": docs3,
                            "Payment": docs,
                            "Category": docs2,
                        })
                    })
                })

            } else {
                res.redirect('/404Page')
            }

        })


    } catch (err) {
        res.status(200).send(err);
    }
})
// ==================================================================== //
router.get('/service', (req, res) => {
    res.render('product/servicePage', {
        title: 'Keyboard Service',
        lubeTitle: 'Lube Service Form',
        assemTitle: 'Assembled Service Form',
    })
})

// function generateInvoice(invoice, filename, success, error) {
//     var postData = JSON.stringify(invoice);
//     var options = {
//         hostname  : "invoice-generator.com",
//         port      : 443,
//         path      : "/",
//         method    : "POST",
//         headers   : {
//             "Content-Type": "application/json",
//             "Content-Length": Buffer.byteLength(postData)
//         }
//     };

//     var file = fs.createWriteStream(filename);

//     var req = https.request(options, function(res) {
//         res.on('data', function(chunk) {
//             file.write(chunk);
//         })
//         .on('end', function() {
//             file.end();

//             if (typeof success === 'function') {
//                 success();
//             }
//         });
//     });
//     req.write(postData);
//     req.end();

//     if (typeof error === 'function') {
//         req.on('error', error);
//     }
// }
// var invoice = {
//     // logo: "http://invoiced.com/img/logo-invoice.png",
//     // logo: "logo.png",
//     logo: "https://drive.google.com/uc?export=view&id=1jtFwxaDyazQeytgNhsfqsXhGTFS5s-wG",
//     from: "Invoiced\nNoobStore\nalley 4, 10 st, Hiep Binh Chanh ward, Thu Duc district\nHo Chi Minh, Vietnam 700000",
//     to: "Khiem Le",
//     currency: "vnd",
//     number: "INV-0024",
//     payment_terms: "Auto-Billed - Do Not Pay",
//     // date : (new Date(Date.now()).toLocaleDateString()),
//     // due_date: (new Date()).toLocaleDateString(),
//     due_date: moment().add(1, 'M').format('MMM DD, YYYY'),
//     items: [
//         {
//             name: "Assembled Service - PCB Canoe Gen 2",
//             quantity: 1,
//             unit_cost: 200000,
//             description: "- Soldered Mill-max hotswap"
//         },
//         // {
//         //     name: "Assembled Service - UTD 360C",
//         //     quantity: 1,
//         //     unit_cost: 400000,
//         //     description: "- Soldered Switches (220) \n - Handle Stabilizer (180) \n - Soldered Cable"
//         // },
//         {
//             name: "Lube Service - Mauve switches x70",
//             quantity: 1,
//             unit_cost: 570000,
//             description: "- Housing/Stem w/ Ghv4 (420) \n - Film clear(white/pink) TX (150) \n - Spring w/ GPL 105"
//         }
//     ],
//     fields: {
//         tax: "%",
//         discounts: true,
//         shipping: true,
//     },
//     discounts: 0,
//     shipping:0,
//     tax: 0,
//     amount_paid: 0,
//     notes: "Thanks for being an awesome customer!",
//     terms: "No need to submit payment. You will be auto-billed for this invoice."
// };
// generateInvoice(invoice, invoice.number+'.pdf', function() {
//     console.log("Saved invoice to invoice.pdf");
// }, function(error) {
//     console.error(error);
// });



router.post('/service/invoice', async(req, res) => {
    console.log(req.body)
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    var customUrl = req.protocol + '://' + req.get('host') + "/invoice/"
    try {
        await Couter.findOne({ _id: 'service_invoice' }, function(err, docs) {
            console.log('incc = ' + docs['seq'])
            function generateInvoice(invoice, filename, success, error) {
                var postData = JSON.stringify(invoice);
                var options = {
                    hostname: "invoice-generator.com",
                    port: 443,
                    path: "/",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Length": Buffer.byteLength(postData)
                    }
                };
                var file = fs.createWriteStream('./invoice/' + filename);
                var url = customUrl + filename;
                // var filePath = '/invoice/'+ filename
                console.log(url)
                var req = https.request(options, function(res) {
                    res.on('data', function(chunk) {
                            file.write(chunk);
                        })
                        .on('end', function() {
                            file.end();

                            if (typeof success === 'function') {
                                success();
                            }
                        });
                });
                var filePath = path.join(__dirname, '..', 'invoice', filename)
                req.write(postData);
                req.end();
                // console.log(filePath, filename)
                // var file = fs.createReadStream('./src/test-data/service/print/notes.pdf');

                    console.log('incc = ' + docs['seq'])
                    db.collection('invoices').insertOne({
                        invoice_id: "INV-"+(docs['seq']+1),
                        // invoice_type:,
                        invoice_details:{
                            path: file
                        },
                        note: '',
                    })

                    
                    

                var stat = fs.statSync('./invoice/' + filename);
                res.setHeader('Content-Length', stat.size);
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename=agreement.pdf');
                res.status(200).json({
                    data: url,
                    file: filename
                })


                if (typeof error === 'function') {
                    req.on('error', error);
                }else{
                    
                }


            }

            var customerName = 'abc';
            var customerMail = "test@abc.com"
            const assem_service = "Assembled Service"
            const lube_service = "Lube Service"
            const buy_service = "Buy Accesssories"
            const price_film = 150000
            const price_spring = 180000
            var lube_service_with_accessories = 6000;
            var lube_service_without_accessories = 5000;
            var price_lube_service = 0
            var items = []
            var description_film, description_spring, description_grease
            var replaceFilm, replaceSpring, replaceGrease

            // req.body.switch_type == "tactile" ? 
            if(req.body.film_color){
                replaceFilm = (req.body.film_color.replace(/_/g, " ")).charAt(0).toUpperCase() + (req.body.film_color.replace(/_/g, " ")).slice(1)

                items.push({
                    name: buy_service + ' - ' + 'Tx Film' + ' ' + replaceFilm,
                        quantity: 1,
                        unit_cost: parseInt(req.body.price_bill['price_film']),
                        description: "- 1 Pack Tx Film" + ' ' + replaceFilm
                })
                description_film = "\n - Film Tx" + ' ' + replaceFilm
            }
            if(req.body.spring_force){
                replaceSpring = (req.body.spring_force.replace(/_/g, " ")).charAt(0).toUpperCase() + (req.body.spring_force.replace(/_/g, " ")).slice(1)
                items.push({
                    name: buy_service + ' - ' + 'Springs' + ' ' + replaceSpring +"cn",
                        quantity: 1,
                        unit_cost: parseInt(req.body.price_bill['price_spring']),
                        description: "- 1 Pack Springs" + ' ' + replaceSpring +"cn"
                })
            }
            if(req.body.grease){
                description_grease = (req.body.grease.replace(/_/g, " ")).charAt(0).toUpperCase() + (req.body.grease.replace(/_/g, " ")).slice(1);
                // replaceGrease = req.body.grease.replace(/_/g, " ");
            }
            if(req.body.switches_quanity){
                items.push({
                        name: lube_service + ' - ' + req.body.switch_type + ' x' + req.body.switches_quanity,
                        quantity: 1,
                        unit_cost: parseInt(req.body.price_bill['lube_service_price_without_accesscories']),
                        description: "- Housing/Stem w/" + ' ' + description_grease +
                                    description_film + 
                                    "\n - Spring w/ GPL 105"
                    })
            }
            
            


            var invoice = {
                logo: "https://drive.google.com/uc?export=view&id=1jtFwxaDyazQeytgNhsfqsXhGTFS5s-wG",
                from: "NoobStore\nnoobassembly@gmail.com\nalley 4, 10 st, Hiep Binh Chanh ward, Thu Duc district\nHo Chi Minh, Vietnam 700000",
                to: customerName + '\n' + customerMail,
                currency: "vnd",
                number: "INV-"+(docs['seq']+1),
                payment_terms: "Auto-Billed - Do Not Pay",
                due_date: moment().add(1, 'M').format('MMM DD, YYYY'),
                items: items,
                //[{
                //         name: "Assembled Service - PCB Canoe Gen 2",
                //         quantity: 1,
                //         unit_cost: 200000,
                //         description: "- Soldered Mill-max hotswap"
                //     },
                    // {
                    //     name: "Assembled Service - UTD 360C",
                    //     quantity: 1,
                    //     unit_cost: 400000,
                    //     description: "- Soldered Switches (220) \n - Handle Stabilizer (180) \n - Soldered Cable"
                    // },
                //     {
                //         name: "Lube Service - Mauve switches x70",
                //         quantity: 1,
                //         unit_cost: 570000,
                //         description: "- Housing/Stem w/ Ghv4 (420) \n - Film clear(white/pink) TX (150) \n - Spring w/ GPL 105"
                //     }
                // ],
                fields: {
                    tax: "%",
                    discounts: true,
                    shipping: true,
                },
                discounts: 0,
                shipping: 0,
                tax: 0,
                amount_paid: 0,
                notes: "Thanks for being an awesome customer!",
                terms: "No need to submit payment. You will be auto-billed for this invoice.",
                // custom_fields: [
                //     {
                //       "name": "Gizmo",
                //       "value": "PO-1234"
                //     },
                //     {
                //       "name": "Account Number",
                //       "value": "CUST-456"
                //     }
                //   ]
            };

            generateInvoice(invoice, new Date().toISOString().replace(/:/g, '-') + invoice.number + '.pdf', function() {
                console.log("Saved invoice to invoice.pdf");
                console.log('./invoice/'+ invoice.number+'.pdf')


                // res.download(path.join(__dirname, '..', 'invoice', invoice.number+ '.pdf'))
            }, function(error) {
                console.error(error);
            });

        })
            db.collection('couters').findAndModify({
                _id: "service_invoice"
            }, {}, {$inc: {"seq": 1 } }, {new: true, upsert: true},
                function(err, docs){
                    console.log(docs)
                }
            )

    } catch (err) {
        console.log("eror" + err)
        res.status(200).send(err);
    }

})

// test drawCanvas

router.get("/drawCanvas", function(req, res){
    res.render('drawCanvas/view/draw')

})

router.get("/fake_parent_select2", function(req, res){
    res.send([{id: 1, name: "Region 1"},{id: 2, name: "Region 2"}]);
})
router.get("/fake_parent_select2/:id", function(req, res){
    if(req.params.id == 1){
        res.send({
          "results": [
            {
              "id": 1,
              "text": "Zone 1"
            },
            {
              "id": 2,
              "text": "Zone 2"
            }
          ],
          "pagination": {
            "more": true
          }
        });
    }else{
        res.send({
          "results": [
            {
              "id": 3,
              "text": "Zone 3"
            },
            {
              "id": 4,
              "text": "Zone 4"
            }
          ],
          "pagination": {
            "more": true
          }
        });
    }
    
})


// ---------------------------------------------------------------------------------------------

router.get('*', function(req, res) {
    res.status(404).render('404Page')
})



module.exports = router;