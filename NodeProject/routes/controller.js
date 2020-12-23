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
    console.log(req.session.Admin);
    console.log(req.decoded)
    console.log(req.cookies.lang)
    if (!req.session.Admin) {
        res.redirect('/api/signin')
    } else {
        var admin = req.session.Admin
        res.render('manager/adminPage', {
            fname: admin['fname'],
            lname: admin['lname'],
            mail: admin['email'],
            lang: req.cookies.lang
        });
    }

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
        res.status(400).send(err);
    }
});
// update db to mongo
router.post("/account/edit/:id", upload.single('picture'), async (req, res) => {
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
    // console.log(res)
    try {
        var account = await AdmAccount.findOne({ email: req.body.email }).exec();
        var active = await AdmAccount.findOne({ $and: [{ email: req.body.email }, { active: true }] });
        console.log(active)

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
            id: account['_id']
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

router.post("/register", upload.single('picture'), (req, res) => {
    console.log(req.file);

    // console.log(req);
    // console.log(req.body.fileuploader-list-picture);
    console.log(req.body);
    try {
        var check = AdmAccount.find({ email: req.body.email }, async (err, docs) => {
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
                var result = account.save();
                // res.send(result);
                res.redirect('/');
            }
        }).exec();
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/refresh_token', async (req, res) => {
    const { refreshToken } = req.body;
    if ((refreshToken) && (refreshToken in tokenList)) {
        try {
            await utils.verifyJwtToken(refreshToken, config.refreshTokenSecret);
            const user = tokenList[refreshToken];
            const token = jwt.sign(user, config.secret, {
                expiresIn: config.tokenLife,
            });
            const response = {
                token,
            }
            res.status(200).json(response);
        } catch (err) {
            console.log(err);
            res.status(403).json({
                message: 'Invalid refresh token'
            });
        }
    } else {
        res.status(400).json({
            message: 'Invalid request'
        });
    }
});


router.get('/profile', TokenCheckMiddleware, (req, res) => {

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
        if (datecreated) {
            var result = await Account.find({ created: { $gte: (todayStart), $lte: todayEnd } }, function(err, docs) {
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

        } else {
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



router.get('/product',TokenCheckMiddleware, async (req, res) => {
    // res.render('manager/categoryPage')
    console.log(res)
    Product.find({}, function(err, docs) {
        Category.find({}, function(err, docs2){

       
        // console.log(docs);
        // console.log(docs2);
        res.render('manager/product/productPage', {
            "listProduct": docs,
            "listCategory": docs2,
        });
    });
    });
})

router.get('/product/getpid/:id', async(req, res)=>{
    // console.log("params"+req.params.id);
    try{
        // var check = await Product.findById(req.params.id).exec()
        var check = await Product.findById(req.params.id, function(err, docs){
            // console.log(docs[0]);
        }).exec();
        
        res.send(check).status(200);
    }catch(err){
        res.send(err).status(404)
    }
})

router.get('/product/getcid/:id', async(req, res)=>{
    console.log("params"+req.params.id);
    try{
        // var check = await Product.findById(req.params.id).exec()
        var check = await Product.find({category_id: req.params.id}, function(err, docs){
            // console.log(docs[0]);
        }).exec();
        
        res.send(check).status(200);
    }catch(err){
        res.send(err).status(404)
    }
})
router.get('/product/add' ,async (req, res) => {

    Category.find({}, function(err, docs) {
        // console.log(docs)
        console.log(docs.length)
        res.render('manager/product/addPage', {
            title: "Add new PRODUCT",
            "listCategoryID": docs
        })
    })



    // res.render('manager/product/addPage',{
    //     title: "Add new PRODUCT"
    // })
})

router.post('/product/add', upload.single('picture') ,async (req, res) => {
    console.log(req.body)
    // console.log(req.body.pid)
    try {
                var part = req.body.p_part;
                console.log(part)
                if(part == 0){ //for top case
                 await Couter.findOne({ _id: "p_top_case" }, function(err, docs) {
                        var inc = docs['seq'] + 1;
                        db.collection('products').insertOne({
                            product_id: "PTOP" + inc,
                            product_name: (req.body.pname),
                            
                            category_id: req.body.catid,
                            product_part: (req.body.p_part),
                            outstock: req.body.outstock,
                            k_top_color: (req.body.top_color),
                            k_top_material: (req.body.top_material),
                            price: (req.body.top_case_price),
                            pic_product: {
                                
                                path: req.file.path,
                                size: req.file.size
                            }
                        })

                    })
                    db.collection("couters").findAndModify({
                            _id: "p_top_case"
                        }, {}, { $inc: { "seq": 1 } }, { new: true, upsert: true },

                        function(err, docs) {
                            console.log(docs);
                        }
                    )
                }else if(part == 1){ //for bot case
                    await Couter.findOne({ _id: "p_bottom_case" }, function(err, docs) {
                        var inc = docs['seq'] + 1;
                     
                        db.collection('products').insertOne({
                            product_id: "PBOT" + inc,
                            product_name: (req.body.pname),
                            category_id: req.body.catid,
                            product_part: (req.body.p_part),
                            outstock: req.body.outstock,
                            k_bot_color: (req.body.bot_color),
                            k_bot_material: (req.body.bot_material),
                            price: (req.body.top_case_price),
                            pic_product: {
                                path: req.file.path,
                                size: req.file.size
                            }
                        })

                    })
                    db.collection("couters").findAndModify({
                            _id: "p_bottom_case"
                        }, {}, { $inc: { "seq": 1 } }, { new: true, upsert: true },

                        function(err, docs) {
                            console.log(docs);
                        }
                    )
                }else if(part == 2){ // for plate
                    await Couter.findOne({ _id: "p_plate" }, function(err, docs) {
                        var inc = docs['seq'] + 1;
                     
                        db.collection('products').insertOne({
                            product_id: "PLATE" + inc,
                            product_name: (req.body.pname),
                            category_id: req.body.catid,
                            product_part: (req.body.p_part),
                            outstock: req.body.outstock,
                            k_plate_option: (req.body.bot_price),
                            k_plate_material: (req.body.plate_material),
                            price: (req.body.plate_price),
                            pic_product: {
                                
                                path: req.file.path,
                                size: req.file.size
                            }
                        })

                    })
                    db.collection("couters").findAndModify({
                            _id: "p_plate"
                        }, {}, { $inc: { "seq": 1 } }, { new: true, upsert: true },

                        function(err, docs) {
                            console.log(docs);
                        }
                    )
                }else if(part == 3){ // for frame
                    await Couter.findOne({ _id: "p_frame" }, function(err, docs) {
                        var inc = docs['seq'] + 1;
                     
                        db.collection('products').insertOne({
                            product_id: "FRAME" + inc,
                            product_name: (req.body.pname),
                            
                            category_id: req.body.catid,
                            product_part: (req.body.p_part),
                            outstock: req.body.outstock,
                            k_top_color: (req.body.top_color),
                            k_top_material: (req.body.top_material),
                            price: (req.body.top_case_price),
                            pic_product: {
                                
                                path: req.file.path,
                                size: req.file.size
                            }
                        })

                    })
                    db.collection("couters").findAndModify({
                            _id: "p_frame"
                        }, {}, { $inc: { "seq": 1 } }, { new: true, upsert: true },

                        function(err, docs) {
                            console.log(docs);
                        }
                    )
                }else if(part == 4) { // keycap
                    await Couter.findOne({ _id: "p_keycap" }, function(err, docs) {
                        var inc = docs['seq'] + 1;
                     
                        db.collection('products').insertOne({
                            product_id: "KEYKIT" + inc,
                            product_name: (req.body.pname),
                            replace_product_name: req.body.replace_product_name,
                            category_id: req.body.catid,
                            product_part: (req.body.p_part),
                            outstock: req.body.outstock,
                            c_code_color: (req.body.code_color),
                            c_profile: (req.body.c_profile),
                            c_material: (req.body.c_material),
                            price: (req.body.c_price),
                            pic_product: {
                                path: req.file.path,
                                size: req.file.size
                            }
                        })

                    })
                    db.collection("couters").findAndModify({
                            _id: "p_keycap"
                        }, {}, { $inc: { "seq": 1 } }, { new: true, upsert: true },

                        function(err, docs) {
                            console.log(docs);
                        }
                    )
                } else if(part == 5){ // for swithces
                    await Couter.findOne({ _id: "p_switches" }, function(err, docs) {
                        var inc = docs['seq'] + 1;
                     
                        db.collection('products').insertOne({
                            product_id: "SWPACK" + inc,
                            product_name: (req.body.pname),
                            replace_product_name: req.body.replace_product_name,
                            category_id: req.body.catid,
                            product_part: (req.body.p_part),
                            outstock: req.body.outstock,
                            price: (req.body.sw_price),
                            pic_product: {
                                path: req.file.path,
                                size: req.file.size
                            }
                        })

                    })
                    db.collection("couters").findAndModify({
                            _id: "p_switches"
                        }, {}, { $inc: { "seq": 1 } }, { new: true, upsert: true },

                        function(err, docs) {
                            console.log(docs);
                        }
                    )
                }else if(part == 7){ // for artisan
                    await Couter.findOne({ _id: "p_artisan"}, function(err, docs){
                        console.log(docs);
                        console.log(docs['seq'])
                        var inc = docs['seq'] + 1;
                        console.log("incc" + inc)

                        db.collection('products').insertOne({
                            product_id: "ARTACC" + inc,
                            product_name: (req.body.pname),
                            replace_product_name: req.body.replace_product_name,
                            category_id: req.body.catid,
                            product_part: (req.body.p_part),
                            outstock: req.body.outstock,
                            price: (req.body.artisan_price),
                            pic_product: {
                                path: req.file.path,
                                size: req.file.size
                            }
                        })
                    })
                    db.collection("couters").findAndModify({
                            _id: "p_artisan"
                        }, {}, { $inc: { "seq": 1 } }, { new: true, upsert: true },

                        function(err, docs) {
                            console.log(docs);
                        }
                    )
                }
                setTimeout(function(){
                    res.redirect('/api/product');
                }, 1500)
    } catch (err) {
        res.status(500).send(err);
    }
})

router.get('/product/edit/:id', function(req, res){
    try{
        
        // var unactive = await Category.findById(req.params.id);
        // console.log(unactive)
        
         Product.findById(req.params.id,function(err, docs){
            console.log(docs);
            var type = docs.product_part;
            console.log(type)
            if(type == 0){
                res.render('manager/product/editPage',{
                    title: 'Edit Product : Keeb Top Case',
                    "product": docs,
                    type: 0
                })
            }else if(type == 1){
                res.render('manager/product/editPage',{
                    title: 'Edit Product : Keeb Bot case',
                    "product": docs,
                    type: 1
                })
            }else if(type == 2){
                res.render('manager/product/editPage',{
                    title: 'Edit Product : Keeb Plate',
                    "product": docs,
                    type: 2
                })

            }else if(type == 3){
                res.render('manager/product/editPage',{
                    title: 'Edit Product : Keeb Frame',
                    "product": docs,
                    type: 3
                })

            }else if(type == 4){
                res.render('manager/product/editPage',{
                    title: 'Edit Product : Keycap',
                    "product": docs,
                    type: 4
                })
            }else if(type == 5){
                res.render('manager/product/editPage',{
                    title: 'Edit Product : Switches',
                    "product": docs,
                    type: 5
                })
            }
            
               
        })
            // function(err, docs){
            // console.log(docs);
        // })
    }catch(err){
        res.status(400).send(err);
    }
})

router.post("/product/edit/:id", upload.single('picture'), async (req, res) => {
    console.log(req.body);
    // console.log(req.file);
    try {
        var check = await Product.findById(req.params
            .id).exec();
            console.log(check)
        var part = check.product_part
        console.log(part)
        if(part == 0){ // top case
            if(req.file == null){
                check.set({ 
                    product_name: req.body.product_name,
                    outstock: req.body.outstock,
                    k_top_color: req.body.top_color,
                    k_top_material : req.body.top_material,
                    price: req.body.price,
                });
            }else{
                check.set({ 
                    product_name: req.body.product_name,
                    outstock: req.body.outstock,
                    k_top_color: req.body.top_color,
                    k_top_material : req.body.top_material,
                    price: req.body.price,
                    pic_product:{
                        path: req.file.path,
                        size: req.file.size
                    }
                });
            }
            

        }else if(part == 1){ // for bot case
            if(req.file == null){
                check.set({ 
                    product_name: req.body.product_name,
                    outstock: req.body.outstock,
                    k_bot_color: req.body.bot_color,
                    k_bot_material : req.body.bot_material,
                    price: req.body.price,
                });
            }else{
                check.set({ 
                    product_name: req.body.product_name,
                    outstock: req.body.outstock,
                    k_bot_color: req.body.bot_color,
                    k_bot_material : req.body.bot_material,
                    price: req.body.price,
                    pic_product:{
                        path: req.file.path,
                        size: req.file.size
                    }
                });
            }

        }else if(part == 2) { // for plate
            if(req.file == null){
                check.set({ 
                    product_name: req.body.product_name,
                    outstock: req.body.outstock,
                    k_plate_option: req.body.plate_option,
                    k_plate_material : req.body.plate_material,
                    price: req.body.price,
                });
            }else{
                check.set({ 
                    product_name: req.body.product_name,
                    outstock: req.body.outstock,
                    k_plate_option: req.body.plate_option,
                    k_plate_material : req.body.plate_material,
                    price: req.body.price,
                    pic_product:{
                        path: req.file.path,
                        size: req.file.size
                    }
                });
            }

        }else if(part == 3){ // for frame
            if(req.file == null){
            }else{
            }

        }else if(part == 4){ // keycap
            console.log("for keycap")
            if(req.file == null){
                check.set({ 
                    product_name: req.body.product_name,
                    replace_product_name: req.body.replace_product_name,
                    outstock: req.body.outstock,
                    c_code_color: req.body.code_color,
                    c_profile : req.body.c_profile,
                    c_material: req.body.c_material,
                    price: req.body.c_price,
                });
            }else{
                check.set({ 
                    product_name: req.body.product_name,
                    replace_product_name: req.body.replace_product_name,
                    outstock: req.body.outstock,
                    c_code_color: req.body.code_color,
                    c_profile : req.body.c_profile,
                    c_material: req.body.c_material,
                    price: req.body.c_price,
                    pic_product:{
                        path: req.file.path,
                        size: req.file.size
                    }
                });
            }
            var result = await check.save();
            // res.status(200).send(result)
            return res.redirect('/api/product');
          

        }else if(part == 5){
            console.log("for switches")
            if(req.file == null){
                check.set({ 
                    product_name: req.body.product_name,
                    replace_product_name: req.body.replace_product_name,
                    outstock: req.body.outstock,
                    price: req.body.sw_price,
                });
            }else{
                check.set({ 
                    product_name: req.body.product_name,
                    replace_product_name: req.body.replace_product_name,
                    outstock: req.body.outstock,
                    price: req.body.sw_price,
                    pic_product:{
                        path: req.file.path,
                        size: req.file.size
                    }
                });
            }
            var result = await check.save();
            // res.status(200).send(result)
            return res.redirect('/api/product');

        }
        

        // check.set({
        //     product_name: req.body.product_name,
        //     price: req.body.price,
        //     outstock: req.body.outstock,
        //     color: req.body.color,
        // });


       


    } catch (err) {
        console.log(err);
        res.status(200).send(err);
    }
});
// product have been deleted when deleting category
router.delete('/product/delete/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        var deleteProduct = await Product.deleteOne({ _id: req.params.id }).exec();

        res.status(200).send(deleteProduct);

    } catch (err) {
        res.status(500).send(err);
    }
});

router.get('/category', async (req, res) => {
    Category.find({}, function(err, docs) {
        res.render('manager/category/categoryPage', {
            "listCategory": docs
        });
    });
})

router.get('/mounting', function(req, res){
    res.render('tips/mountingPage')
})

router.get('/category/add', function(req, res){
    // var c = __dirname+req.path.replace(/\//g, '\\');
    
    // var z = path.resolve(c);
    
    // var x = fs.existsSync(c)?res.sendFile(path.resolve(c)):(res.statusCode=404)
    // console.log("c")
    // console.log(c);
    // console.log("z")
    // console.log(z);
    // console.log("x")
    // console.log(x);

    // var m = fs.existsSync(c);
    // console.log(m)

    res.render('manager/category/addPage', {
        title: "Add new CATEGORY"
    })
})




// upload.single('picture'),'

router.post('/category/add',upload.single('picture'), async(req, res)=>{
    console.log((req.body));
    try {
        var check = await Category.find({ category_id: req.body.catid }, async (err, docs) => {
            if (docs.length) {
                res.status(400).json({
                    code: 400,
                    message: "category id already exists"
                })
            } else {

                var type = req.body.type;
                // if type = keeb
                if (type == 0) {
                    Couter.findOne({ _id: "keeb" }, function(err, docs) {
                        console.log(docs);
                        console.log(docs['seq'])
                        var inc = docs['seq'] + 1;
                        console.log("incc"+inc)

                        // var uploader = fileuploader('files', { uploadDir: 'docs/upload/' }, req, res);
                        // uploader.upload(function(data) {
                        //     console.log(data.files);
                        //     console.log(data.files[0].size)
                        //     res.end(JSON.stringify(data, null, 4));
                        // });

                        db.collection('categories').insertOne({
                            category_id: "KEEB" + inc,
                            category_name: (req.body.catname),
                            author: req.body.author,
                            manufacturing: req.body.manufacturing,
                            proxy_host: req.body.host,
                            status_gb: (req.body.status),
                            k_color: (req.body.k_color),
                            type: (req.body.type),
                            flip: (req.body.flip),
                            k_layout:  (req.body.k_layout),
                            k_degree: (req.body.k_degree),
                            k_mounting: (req.body.k_mounting),
                            k_plate_option: req.body.k_plate,
                            date_start:(req.body.date_start),
                            date_end: (req.body.date_end),
                            date_payment: (req.body.date_payment),
                            min_price: (req.body.min_price),
                            max_price: (req.body.max_price),
                            tax: req.body.tax,
                            handle: req.body.hns,
                            specs: req.body.specs,
                            pic_profile: {
                                // path: (data.files[0].file),
                                // size: (data.files[0].size2)
                                path: req.file.path,
                                size: req.file.size
                            }
                        })

                    })
                    db.collection("couters").findAndModify({
                            _id: "keeb"
                        }, {}, { $inc: { "seq": 1 } }, { new: true, upsert: true },

                        function(err, docs) {
                            console.log(docs);
                        }
                    )
                    // if type = keyset
                } else if (type == 1) {
                    Couter.findOne({ _id: "keyset" }, function(err, docs) {
                       console.log(docs);
                        console.log(docs['seq'])
                        var inc = docs['seq'] + 1;
                        console.log("incc"+inc)

                        db.collection('categories').insertOne({
                            category_id: "KSET" + inc,
                            category_name: req.body.catname,
                            author: req.body.author,
                            manufacturing: req.body.manufacturing,
                            proxy_host: req.body.host,
                            status_gb: req.body.status,
                            c_code_color: req.body.code_color,
                            type: req.body.type,
                            c_profile: req.body.profile,
                            c_material: req.body.c_material,
                            date_start: req.body.date_start,
                            date_end: req.body.date_end,
                            date_payment: req.body.date_payment,
                            min_price: req.body.min_price,
                            max_price: req.body.max_price,
                            tax: req.body.tax,
                            handle: req.body.hns,
                            specs: req.body.specs,
                            pic_profile: {
                                path: req.file.path,
                                size: req.file.size
                            }
                            
                        })

                    })
                    db.collection("couters").findAndModify({
                            _id: "keyset"
                        }, {}, { $inc: { "seq": 1 } }, { new: true, upsert: true },

                        function(err, docs) {
                            console.log(docs);
                        }
                    )
                } else { //for etc
                    Couter.findOne({ _id: "etc" }, function(err, docs) {
                        console.log(docs);
                         console.log(docs['seq'])
                         var inc = docs['seq'] + 1;
                         console.log("incc"+inc)
 
                         db.collection('categories').insertOne({
                             category_id: "ETC" + inc,
                             category_name: req.body.catname,
                             author: req.body.author,
                             manufacturing: req.body.manufacturing,
                             proxy_host: req.body.host,
                             status_gb: req.body.status,
                             type: req.body.type,
                             date_start: req.body.date_start,
                             date_end: req.body.date_end,
                             date_payment: req.body.date_payment,
                             min_price: req.body.min_price,
                             max_price: req.body.max_price,
                             tax: req.body.tax,
                             handle: req.body.hns,
                             specs: req.body.specs,
                             pic_profile: {
                                 path: req.file.path,
                                 size: req.file.size
                             }
                             
                         })
 
                     })
                     db.collection("couters").findAndModify({
                             _id: "etc"
                         }, {}, { $inc: { "seq": 1 } }, { new: true, upsert: true },
 
                         function(err, docs) {
                             console.log(docs);
                         }
                     )

                }
            }
        }).exec();
        setTimeout(function(){
            res.redirect('/api/category');
        }, 1500)
        
    } catch (err) {
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

router.get('/category/edit/:id', async(req, res)=>{
    // console.log(req.params.id)
    try{
        
        // var unactive = await Category.findById(req.params.id);
        // console.log(unactive)
        
        await Category.findById(req.params.id,function(err, docs){
            // console.log(docs);
            // console.log(docs.type);
            var type = docs.type;
            if(type == 0){
                res.render('manager/category/editPage',{
                    title: 'Edit Category : Keeb',
                    "category": docs,
                    type: 0
                })
            }else if(type == 1){
                res.render('manager/category/editPage',{
                    title: 'Edit Category : Keyset',
                    "category": docs,
                    type: 1
                })
            }else{
                res.render('manager/category/editPage',{
                    title: 'Edit Category : ETC',
                    "category": docs,
                    type: 2
                })

            }
            
               
        })
            // function(err, docs){
            // console.log(docs);
        // })
    }catch(err){
        res.status(400).send(err);
    }
})

router.get('/category/get/:id', async(req, res) =>{
    
    try{
        var check = await Category.findById(req.params.id).exec();
        res.send(check).status(200);
    }catch(err){
        res.send(err).status(404)
    }
})

router.get('/category/getcid/:id', async(req, res) =>{
    // console.log("req.prams "+ req.params.id)
    try{
        var check = await Category.findOne({category_id: req.params.id}).exec();
        // console.log(check);
        res.send(check).status(200);
    }catch(err){
        res.send(err).status(404)
    }
})

router.post("/category/edit/:id", upload.single('picture'),async (req, res) => {
    console.log(req.body);
    console.log(req.params.id)
    // console.log(req.file);
    try {
        var check = await Category.findById(req.params
            .id).exec();

            // console.log(check);
            var type = check.type;
            console.log("type = " + type);
            // for keeb
            if(type == 0){
                if(req.file == null){
                    check.set({
                        category_name: req.body.catname,
                        author: req.body.author,
                        manufacturing: req.body.manufacturing,
                        proxy_host: req.body.host,
                        status_gb: req.body.status,
                        k_color: req.body.k_color,
                        flip: req.body.flip,
                        k_layout:  req.body.k_layout,
                        k_degree: req.body.k_degree,
                        k_mounting: req.body.k_mounting,
                        date_start: req.body.date_start,
                        date_end: req.body.date_end,
                        date_payment: req.body.date_payment,
                        min_price: req.body.min_price,
                        max_price: req.body.max_price,
                        tax: req.body.tax,
                        handle: req.body.hns,
                        specs: req.body.specs
                    });
                }else{
                    check.set({
                        category_name: req.body.catname,
                        author: req.body.author,
                        manufacturing: req.body.manufacturing,
                        proxy_host: req.body.host,
                        status_gb: req.body.status,
                        k_color: req.body.k_color,
                        flip: req.body.flip,
                        k_layout:  req.body.k_layout,
                        k_degree: req.body.k_degree,
                        k_mounting: req.body.k_mounting,
                        date_start: req.body.date_start,
                        date_end: req.body.date_end,
                        date_payment: req.body.date_payment,
                        min_price: req.body.min_price,
                        max_price: req.body.max_price,
                        tax: req.body.tax,
                        handle: req.body.hns,
                        specs: req.body.specs,
                        pic_profile: {
                            path: req.file.path,
                            size: req.file.size
                        }
                    });

                }
                

                var result = await check.save();
                // res.status(200).send(result)
                return res.redirect('/api/category');

            }else if(type == 1){// for keyset
                if(req.file == null){
                    check.set({
                        category_name: req.body.catname,
                        author: req.body.author,
                        manufacturing: req.body.manufacturing,
                        proxy_host: req.body.host,
                        status_gb: req.body.status,
                        c_code_color: req.body.code_color,
                        c_profile:  req.body.profile,
                        c_material: req.body.c_material,
                        date_start: req.body.date_start,
                        date_end: req.body.date_end,
                        date_payment: req.body.date_payment,
                        min_price: req.body.min_price,
                        max_price: req.body.max_price,
                        tax: req.body.tax,
                        handle: req.body.hns,
                        specs: req.body.specs
                    });
                }else{
                    check.set({
                        category_name: req.body.catname,
                        author: req.body.author,
                        manufacturing: req.body.manufacturing,
                        proxy_host: req.body.host,
                        status_gb: req.body.status,
                        c_code_color: req.body.code_color,
                        c_profile:  req.body.profile,
                        c_material: req.body.c_material,
                        date_start: req.body.date_start,
                        date_end: req.body.date_end,
                        date_payment: req.body.date_payment,
                        min_price: req.body.min_price,
                        max_price: req.body.max_price,
                        tax: req.body.tax,
                        handle: req.body.hns,
                        specs: req.body.specs,
                        pic_profile: {
                            path: req.file.path,
                            size: req.file.size
                        }
                    });
                }
                

                var result = await check.save();
                // res.status(200).send(result)
                return res.redirect('/api/category');

            }else if(type == 2){
                if(req.file == null){
                    check.set({
                        category_name: req.body.catname,
                        author: req.body.author,
                        manufacturing: req.body.manufacturing,
                        proxy_host: req.body.host,
                        status_gb: req.body.status,
                        date_start: req.body.date_start,
                        date_end: req.body.date_end,
                        date_payment: req.body.date_payment,
                        min_price: req.body.min_price,
                        max_price: req.body.max_price,
                        tax: req.body.tax,
                        handle: req.body.hns,
                        specs: req.body.specs
                    });
                }else{
                    check.set({
                        category_name: req.body.catname,
                        author: req.body.author,
                        manufacturing: req.body.manufacturing,
                        proxy_host: req.body.host,
                        status_gb: req.body.status,
                        date_start: req.body.date_start,
                        date_end: req.body.date_end,
                        date_payment: req.body.date_payment,
                        min_price: req.body.min_price,
                        max_price: req.body.max_price,
                        tax: req.body.tax,
                        handle: req.body.hns,
                        specs: req.body.specs,
                        pic_profile: {
                            path: req.file.path,
                            size: req.file.size
                        }
                    });
                }
                

                var result = await check.save();
                // res.status(200).send(result)
                return res.redirect('/api/category');

            }
       


    } catch (err) {
        console.log(err);
        res.status(200).send(err);
    }
});
// product have been deleted when deleting category
router.delete('/category/delete/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        // var deleteCategory = await Category.deleteOne({ _id: req.params.id }).exec();
        var checkCategory = await Category.findById(req.params.id).exec();
        console.log(checkCategory)
        console.log(checkCategory.category_id)
        var checkProduct = await Product.find({ category_id: checkCategory.category_id }).exec();
        console.log(checkProduct)


        var deleteCategory = await Category.deleteOne({ _id: req.params.id }).exec();
        var deleteProduct = await Product.deleteMany({ category_id: checkCategory.category_id }).exec();

        res.send({ deleteCategory, deleteProduct });
        // res.write(deleteCategory);
        // res.write(deleteProduct);

    } catch (err) {
        res.status(500).send(err);
    }
});

// Get list Ads Product
router.get('/adsproduct', async(req, res)=>{
    AdsProduct.find({}, function(err, docs) {
        res.render('manager/ads_product/listPage', {
            "listAdsProduct": docs
        });
    });
})
router.get('/adsproduct/add', async(req, res)=>{
    res.render('manager/ads_product/addPage', {
        title: "Ads Product - Add New"
    })
})

router.post('/adsproduct/add', uploadAdsProduct.single('picture'), async(req, res)=>{
    try{
        db.collection('adsproducts').insertOne({
            product_name: req.body.adsproduct_name,
            author_name: req.body.adsproduct_author,
            status: req.body.adsproduct_status,
            specs: req.body.adsproduct_specs,
            pic_product: {
                path: req.file.path,
                size: req.file.size
            },
            date_add: new Date()
            
        })

        setTimeout(function(){
            res.redirect('/api/adsproduct');
        }, 1500)

    }catch(err){
        res.status(500).send(err)
    }
})

router.get('/adsproduct/edit/:id', function(req, res){
    AdsProduct.findById(req.params.id,function(err, docs){
        res.render('manager/ads_product/editPage', {
            title: "Ads Product - Edit #" + req.params.id,
            'data': docs
        })
    })
})

router.post('/adsproduct/edit/:id', uploadAdsProduct.single('picture'), async(req, res)=>{
    console.log(req.body)
    try{
        var checkAdsProduct = await AdsProduct.findById(req.params
            .id).exec();
        if(req.file){
            checkAdsProduct.set({
                product_name: req.body.adsproduct_name,
                author_name: req.body.adsproduct_author,
                specs: req.body.adsproduct_specs,
                status: req.body.adsproduct_status,
                pic_product:{
                    path: req.file.path,
                    size: req.file.size,
                }
            })
        }else{
            checkAdsProduct.set({
                product_name: req.body.adsproduct_name,
                author_name: req.body.adsproduct_author,
                status: req.body.adsproduct_status,
                specs: req.body.adsproduct_specs,

            })
        }
        
        var result = await checkAdsProduct.save();
        return res.redirect('/api/adsproduct/');
    }catch(err){
        res.status(500).send(err)
    }
})

router.get('/adsproduct/get/:id', async(req, res) =>{
    
    try{
        var checkAdsProduct = await AdsProduct.findById(req.params.id).exec();
        res.send(checkAdsProduct).status(200);
    }catch(err){
        res.send(err).status(404)
    }
})

router.delete('/adsproduct/delete/:id', async (req, res) => {
    console.log(req.params.id)
    try {
        var checkAdsProduct = await AdsProduct.findById(req.params.id).exec();
        console.log(checkAdsProduct)

        // if(checkAdsProduct)

        var deleteAdspProduct = await AdsProduct.deleteOne({ _id: req.params.id }).exec();
        res.send({ deleteAdspProduct });
       

    } catch (err) {
        res.status(500).send(err);
    }
});

// Content Page

router.get('/oldcontent', (req, res)=>{
    PageContent.find({}, function(err, docs){
            res.render('manager/content/listPage', {
                'listContent': docs,
                title: 'Content',
            })
        })
})

router.get('/content', TokenCheckMiddleware, (req, res)=>{
    var admin = req.session.Admin
    if(admin){
        PageContent.find({}, function(err, docs){
            res.render('manager/content/new_listPage', {
                fname: admin['fname'],
                lname: admin['lname'],
                mail: admin['mail'],
                'listContent': docs,
                title: 'Content',
                lang: req.cookies.lang
            })
        })
    }else{
        return res.redirect('/api/signin');
    }
    
})
router.get('/content/add', (req, res)=>{
    res.render('manager/content/addPage', {
        title: 'Content - Add New'
    })
})
router.post('/content/add', (req, res)=>{
    console.log(req.body)
    try{
        db.collection('mainpage_contents').insertOne({
            content_type: req.body.content_type,
            status: req.body.content_status,
            specs: req.body.content_specs,
            date_add: new Date()
        })
        setTimeout(function(){
            res.redirect('/api/content');
        }, 1500)

    }catch(err){
        res.status(500).send(err)
    }
})
router.get('/content/edit/:id', (req,res)=>{
    try{
        PageContent.findById(req.params.id, function(err,docs){
            res.render('manager/content/editPage', {
                title: 'Content - Edit #' + req.params.id,
                'data': docs
            })
        })
    }catch(err){
        res.status(500).send(err)
    }
})
router.get('/content/get/:id', async(req, res) =>{
    
    try{
        var checkContent = await PageContent.findById(req.params.id).exec();
        res.send(checkContent).status(200);
    }catch(err){
        res.send(err).status(404)
    }
})
router.post('/content/edit/:id', async(req, res)=>{
    console.log(req.body)
    try{
        var checkContent = await PageContent.findById(req.params
            .id).exec();
        checkContent.set({
            content_type: req.body.content_type,
            status: req.body.content_status,
            specs: req.body.content_specs,
        })
        
        var result = await checkContent.save();
        return res.redirect('/api/content/');
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router;