const express = require('express');
const router = express.Router();
const request = require('request');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const readline = require('readline');
const jwt = require('jsonwebtoken');
const path = require('path');
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
const LocalStorage = require('node-localstorage').LocalStorage;

router.use(cookieParser());
const i18n = require('i18n');
// var cors = require('cors');
const app = express();
const tokenList = {};

// jwt.sign({foo: 'bar'}, privateKey, {algorithm: 'RS256'}, function(err, token){
//     console.log(token)
// });

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'docs/upload/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  },
});
var mongoose = require('mongoose');
var db = mongoose.connection;
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
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
var EventProduct = require('./../db/model/eventproduct');
var PageContent = require('./../db/model/mainpage_content');
var Category = require('./../db/model/category');
var Couter = require('./../db/model/couter');
var MoneyRate = require('../db/model/money_rate');
var TokenCheckMiddleware = require('./../lib/check/checktoken');
var TokenUserCheckMiddleware = require('./../lib/check/checktokenproduct.js');
var SessionCheckMiddleware = require('./../lib/check/checksession');
var CountMiddleware = require('./../lib/check/countproduct');
var BlogCategory = require('./../db/model/blogCategory');
var BlogPost = require('./../db/model/blogPost');

// i18n.configure({
//     locales:['en', 'vi'],
//     directory: __dirname + '/locales',
//     cookie: 'lang',
// })

var corsOptions = {
  origin: 'http://example.com',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(
  session({
    saveUninitialized: true,
    name: 'mycookie',
    resave: true,
    secret: config.secret,
    cookie: {
      secure: false,
      maxAge: 1800000,
    },
  })
);

// app.use(cors());

app.use('/change-lang/:lang', (req, res) => {
  res.cookie('lang', req.params.lang, { maxAge: 900000 });
  res.redirect('back');
});

router.post('/login', async (req, res, next) => {
  res.cookie('lang', 'en', { maxAge: 900000 });
  try {
    var account = await Account.findOne({
      email: req.body.email.toLowerCase(),
    }).exec();
    var active = await Account.findOne({
      $and: [{ email: req.body.email.toLowerCase() }, { active: true }],
    });
    if (!account) {
      return res.status(400).send({
        status: 'error',
        message: 'The user does not exist ',
      });
    }
    if (!bcrypt.compareSync(req.body.password, account.password)) {
      return res.status(400).send({
        status: 'error',
        message: 'The password is not correct',
      });
    }
    if (!active) {
      return res.status(400).send({
        status: 'error',
        message: 'Please active your account',
      });
    }

    const user = {
      email: req.body.email.toLowerCase(),
      password: req.body.password,
      user_id: account._id,
    };
    const token = jwt.sign(user, config.secret, {
      expiresIn: config.tokenLife,
    });
    const refreshToken = jwt.sign(user, config.refreshTokenSecret, {
      expiresIn: config.refreshTokenLife,
    });
    tokenList[refreshToken] = user;
    const response = {
      token,
      refreshToken,
    };
    var check = userToken
      .find({ email: req.body.email.toLowerCase() }, async (err, docs) => {
        if (docs.length) {
          // userToken.set(req.body);
          db.collection('usertokens').updateOne(
            { email: req.body.email },
            {
              $set: {
                token: response.token,
                refreshToken: response.refreshToken,
              },
            }
          );
        } else {
          var accToken = new userToken({
            email: req.body.email.toLowerCase(),
            token: response.token,
            refreshToken: response.refreshToken,
            ip: req.ip,
          });
          accToken.save();
        }
      })
      .exec();

    res.cookie('x-token', response.token, { maxAge: 6000000 });
    res.cookie('x-refresh-token', response.refreshToken, { maxAge: 6000000 });
    res.cookie('lang', 'vi', { maxAge: 900000 });
    req.session.User = {
      email: account['email'],
      fname: account['fname'],
      lname: account['lname'],
      id: account['_id'],
      shipping_at: account['shipping_at'],
    };

    req.session.save(function (err) {
      // session saved
      if (!err) {
        //Data get lost here
        res.redirect('/');
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/', function (req, res) {
  var getName, getId;
  const limit = 5;

  AdsProduct.find({}, function (err, docs) {
    PageContent.find({}, function (ContentErr, ContentDocs) {
      EventProduct.find({ status: 1 }, function (EProductErr, EProductDocs) {
        EventProduct.findOne({}, function (errOne, eProductData) {
          getId = eProductData.event_product_name;
          Category.findOne(
            { category_id: getId },
            function (errTwo, getNameCategoryData) {
              getName = getNameCategoryData.category_name;
              if (EProductDocs.length > 0) {
                EProductDocs.forEach(function (item) {
                  var imgUrl = item.event_product_image.path;
                  var replaceIcon = imgUrl.replace(/\\/g, '/');
                  var imgBg = 'api/' + replaceIcon;

                  if (req.session.User == null) {
                    res.render('index', {
                      user: null,
                      listAdsProduct: docs,
                      listContent: ContentDocs,
                      EventProduct: EProductDocs,
                      images: imgBg,
                      date_start: item.date_start,
                      nameEventProduct: getName,
                    });
                  } else {
                    Account.findOne(
                      { email: req.session.User['email'] },
                      function (errAccount, getAccount) {
                        res.render('index', {
                          user: req.session.User['email'],
                          userName: getAccount.fname + ' ' + getAccount.lname,
                          listAdsProduct: docs,
                          listContent: ContentDocs,
                          EventProduct: EProductDocs,
                          images: imgBg,
                          date_start: item.date_start,
                          nameEventProduct: getName,
                        });
                      }
                    );
                  }
                });
              } else {
                if (req.session.User == null) {
                  res.render('index', {
                    user: null,
                    listAdsProduct: docs,
                    listContent: ContentDocs,
                    EventProduct: [],
                  });
                } else {
                  res.render('index', {
                    user: req.session.User['email'],
                    listAdsProduct: docs,
                    listContent: ContentDocs,
                    EventProduct: [],
                  });
                }
              }
            }
          );
        });
      });
    });
  }).limit(limit);
});

router.get('/time_event', function (req, res) {
  EventProduct.find({ status: 1 }, function (EProductErr, EProductDocs) {
    EProductDocs.forEach(function (item) {
      res.send(item.date_end);
    });
  });
});

router.get('/register', async (req, res) => {
  res.render('product/registerPage', {
    currentPage: 'Login',
    userName: null,
  });
});

router.get('/account', TokenUserCheckMiddleware, async (req, res) => {
  if (req.session.User == null) {
    res.render('product/registerPage', {
      user: null,
      userName: null,
      currentPage: 'Register',
    });
  } else {
    Account.findOne(
      { email: req.session.User['email'] },
      function (errAccount, getAccount) {
        res.render('product/accountPage', {
          user: getAccount,
          userName: getAccount.fname + ' ' + getAccount.lname,
          currentPage: 'Account',
        });
      }
    );
  }
});

router.get('/chucnang', async (req, res) => {
  res.render('product/accountPage');
});

router.get('/account/address', async (req, res) => {
  if (!req.session.User) {
    res.redirect('/');
  } else {
    Account.find({ email: req.session.User['email'] }, function (err, docs) {
      var address = docs[0].shipping_at;
      if (address == null || address == 'undefined') {
        res.render('product/addressPage', {
          listAddress: null,
        });
      } else {
        res.render('product/addressPage', {
          listAddress: docs,
        });
      }
    });
  }
});

router.get('/shop', (req, res) => {
  Category.find({}, function (err, docs) {
    Product.find({}, function (err, pData) {
      EventProduct.findOne({}, function (err, epData) {
        let arrayHaveChild = [];
        pData.filter((prods) => {
          for (let i = 0; i < docs.length; i++) {
            if (prods.category_id === docs[i].category_id) {
              let findIndex = arrayHaveChild.findIndex(
                (child) => child.category_id === docs[i].category_id
              );
              if (findIndex === -1) {
                arrayHaveChild.push(docs[i]);
              }
            }
          }
        });
        if (req.session.User == null) {
          res.render('product/proxyPage', {
            user: null,
            userName: null,
            listCategory: arrayHaveChild,
            listProduct: pData,
            ePID: epData.event_product_name,
            currentPage: 'Shop',
          });
        } else {
          Account.findOne(
            { email: req.session.User['email'] },
            function (errAccount, getAccount) {
              res.render('product/proxyPage', {
                user: req.session.User['email'],
                userName: getAccount.fname + ' ' + getAccount.lname,
                listCategory: arrayHaveChild,
                listProduct: pData,
                ePID: epData.event_product_name,
                currentPage: 'Shop',
              });
            }
          );
        }
      });
    });
  });
});

router.get('/getshop', (req, res) => {
  Category.find({}, function (err, docs) {
    Product.find({}, function (err, pData) {
      EventProduct.findOne({}, function (err, epData) {
        res
          .send({
            listCategory: docs,
            listProduct: pData,
            ePID: epData.event_product_name,
          })
          .status(200);
      });
    });
  });
});

router.post('/captcha', async (req, res) => {});

// API register
// return code: 400 and message: with each case
router.post('/account', async (req, res, next) => {
  try {
    await Account.find({ email: req.body.email }, async (err, docs) => {
      // not using email of admin
      if (req.body.email == config.admin || req.body.email == config.mod) {
        return res.status(400).send({
          code: 400,
          message: 'Mail already exits!!!',
        });
      }
      // if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null){
      //         return res.status(400).sned({
      //             code: 400,
      //             message: "Please select captcha first"
      //         });
      // }
      // check email already have ?
      if (docs.length) {
        return res.status(400).send({
          code: 400,
          message: 'Mail already exits!!!',
        });
      } else {
        //dont forget remove comment when upload server
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
          email: req.body.email,
          password: req.body.password,
          active: false,
        });
        account.save();

        const user = {
          email: req.body.email,
          password: req.body.password,
        };
        const token = jwt.sign(user, config.secret, {
          expiresIn: config.tokenLife,
        });
        const refreshToken = jwt.sign(user, config.refreshTokenSecret, {
          expiresIn: config.refreshTokenLife,
        });
        tokenList[refreshToken] = user;
        const response = {
          token,
          refreshToken,
        };

        await userToken
          .find({ email: req.body.email }, async (err, docs) => {
            if (docs.length) {
              // userToken.set(req.body);
              // db.collection('usertokens').updateOne({ email: req.body.email }, { $set: { token: response.token, refreshToken: response.refreshToken } })
            } else {
              var accToken = new userToken({
                email: req.body.email,
                token: response.token,
                refreshToken: response.refreshToken,
              });
              accToken.save();
            }
          })
          .exec();

        var transporter = nodemailer.createTransport({
          service: 'Gmail',
          auth: {
            user: 'noobassembly@gmail.com',
            pass: 'gsrfewqfnplyltcz',
          },
        });
        var link =
          'https://' + req.get('host') + '/verify?id=' + response.token;
        var logo = 'https://' + req.get('host') + '/favicon/big_logo.png';
        var mainOptions = {
          from: 'NoobStore <noobassembly@gmail.com>',
          to: req.body.email,
          subject: '[NoobStore] Please verify your email address',
          text: 'You received message from ' + req.body.email,
          html:
            "<img src='" +
            logo +
            "' width='150' height='70'/><br><br><p style='font-weight: 600;font-size:22px'>Hi <b>" +
            req.body.lname +
            "</b>,</p><br><p style='font-size:18px'>We're happy you signed up for NoobStore.To finish registration, please confirm your email address.</p><br><p><div><a style='background: #007bff;padding: 9px;width: 200px;color: #fff;text-decoration: none;display: inline-block;font-weight: bold;text-align: center;letter-spacing: 0.5px;border-radius: 50px;font-size:20px' href=" +
            link +
            ">Verify now</a></div><br><p style='font-size:18px'>Welcome to NoobStore!</p><br><br><p style='font-size:18px'>Once verified, you can join and get notification from NoobStore. If you have any problems, please contact us: noobassembly@gmail.com</p></p>",
        };

        transporter.sendMail(mainOptions, function (err, info) {
          if (err) {
            res.redirect('/');
          } else {
            res.redirect('/');
          }
        });
      }
    }).exec();
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/get_session', (req, res) => {
  //check session
  if (req.session.User) {
    return res
      .status(200)
      .json({ status: 'success', session: req.session.User });
  }
  return res
    .status(200)
    .json({ status: 'error', session: 'No session', code: 200 });
});

router.get('/get_noti', TokenUserCheckMiddleware, async (req, res) => {
  var account = await Account.findOne({ email: req.decoded['email'] }).exec();
  return res.status(200).json({
    status: 'success',
    noti: {
      get_noti: account.get_noti,
    },
  });
});

router.get('/get_cookie', async (req, res) => {
  if (req.cookies['x-token'] && req.session.User) {
    var account = await Account.findOne({
      email: req.session.User['email'],
    }).exec();
    return res.status(200).json({
      status: 'success',
      session: {
        id: account._id,
        email: account.email,
        fname: account.fname,
        lname: account.lname,
      },
    });
  }
  return res
    .status(200)
    .json({ status: 'error', session: 'No session', code: 200 });
});

router.get('/clear_session', (req, res) => {
  req.session.destroy(function (err) {
    return res
      .status(200)
      .json({ status: 'success', session: 'cannot access session here' });
  });
});

router.get('/verify', async (req, res) => {
  var getTimeActive = new Date();
  try {
    var checkToken = await userToken.findOne({ token: req.query['id'] }).exec();
    var checkActive = await Account.findOne({ email: checkToken['email'] });
    if (checkToken && checkActive['active'] == false) {
      db.collection('accounts').updateOne(
        { email: checkToken['email'].toLowerCase() },
        { $set: { active: true, actived_date: getTimeActive } }
      );
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/reset-password', (req, res) => {
  res.render('product/forgotPasswordPage', {
    currentPage: 'forgot-password',
    userName: '',
    email: '',
  });
});

router.get('/update-password', async (req, res) => {
  const uid = req.query.uid;
  try {
    const curentTime = Math.floor(Date.now() / 1000);
    var checkExpiredTime = await Account.findOne({
      registration_token: uid,
    }).exec();
    if (curentTime < checkExpiredTime.expiration_token_date) {
      res.redirect('/');
    } else {
      res.render('product/expiredPage', {
        currentPage: 'forgot-password',
        userName: '',
        email: '',
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/forgot_password', async (req, res) => {
  try {
    var checkExist = await Account.findOne({ email: req.body.email });
    if (checkExist) {
      const user = {
        email: req.body.email,
      };
      const token = jwt.sign(user, config.secret, {
        expiresIn: config.tokenForgotPwLife,
      });
      const response = {
        token,
      };
      await db.collection('accounts').updateOne(
        {
          email: req.body.email,
        },
        {
          $set: {
            registration_token: response.token,
            expiration_token_date: config.tokenForgotPwLife,
          },
        }
      );
      var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'noobassembly@gmail.com',
          pass: 'gsrfewqfnplyltcz',
        },
      });
      var link =
        'https://' + req.get('host') + '/update-password?uid=' + response.token;
      var logo = 'https://' + req.get('host') + '/favicon/big_logo.png';
      var mainOptions = {
        from: 'NoobStore <noobassembly@gmail.com>',
        to: req.body.email,
        subject: '[NoobStore] Password Reset ',
        text: 'You received message from ' + req.body.email,
        html:
          "<img src='" +
          logo +
          "' width='150' height='70'/><br><br><p style='font-weight: 600;font-size:22px'>Hi <b>Strange mate</b>,</p><br><p style='font-size:18px'>Please click the following button to reset your password:</p><br><p><div><a style='background: #007bff;padding: 9px;width: 200px;color: #fff;text-decoration: none;display: inline-block;font-weight: bold;text-align: center;letter-spacing: 0.5px;border-radius: 50px;font-size:20px' href=" +
          link +
          ">Reset now</a></div><br><p style='font-size:18px'>Best Regards,<br>The Noob Team</p>",
      };

      transporter.sendMail(mainOptions, function (err, info) {
        if (err) {
          res.redirect('/register');
        } else {
          res.redirect('/');
        }
      });
    } else {
      res.status(404).send('Please re-check your email !');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/updateaccount', TokenUserCheckMiddleware, async (req, res) => {
  const uemail = req.decoded['email'];
  try {
    var account = await Account.findOne({ email: uemail }).exec();
    if (!account) {
      return res.status(400).send({
        status: 'error',
        message: 'The user does not exist ',
      });
    }

    if ((req.body.currentpw == '') & (req.body.newpw == '')) {
      db.collection('accounts').updateOne(
        {
          email: uemail,
        },
        {
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
            get_noti: req.body.get_noti,
          },
        }
      );

      res.redirect('/account');
    } else {
      if (!bcrypt.compareSync(req.body.currentpw, account.password)) {
        return res.status(400).send({
          status: 'error',
          message: 'The password is not correct',
        });
      }
      req.body.newpw = bcrypt.hashSync(req.body.newpw, 10);
      account.set({ password: req.body.newpw });
      await account.save();
      res.redirect('/account');
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

// ------------------------- ADDRESS CONFIG--------------------------------

router.post(
  '/account/addaddress',
  TokenUserCheckMiddleware,
  async (req, res) => {
    var uemail = req.decoded['email'];
    try {
      db.collection('accounts').update(
        {
          email: uemail,
        },
        {
          $addToSet: {
            shipping_at: {
              _id: new mongoose.Types.ObjectId().toString(),
              lname: req.body.lname,
              fname: req.body.fname,
              cname: req.body.cname,
              email: req.body.email.toLowerCase(),
              phone_number: req.body.pnumber,
              address: req.body.address,
              country: req.body.country,
              town_city: req.body.towncity,
              zip_code: req.body.postcode,
            },
          },
        }
      );
      res.redirect('/account/address');
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

router.delete('/delete-address/:id', async (req, res) => {
  var uemail = 'rapsunl231@gmail.com';
  try {
    var address = db.collection('accounts').update(
      {
        email: uemail,
      },
      {
        $pull: {
          shipping_at: {
            cảt_id: req.params.id,
          },
        },
      }
    );

    res.send(address);
  } catch (err) {
    res.status(500).send(err);
  }
});

// ---------------------------------------------------------------------------------------------

router.post('/updatepassword', async (req, res) => {
  const uemail = req.cookies['x-email'];
  try {
    var account = await Account.findOne({ email: uemail }).exec();
    if (!bcrypt.compareSync(req.body.currentpw, account.password)) {
      return res.status(400).send({
        status: 'error',
        message: 'The password is not correct',
      });
    }
    req.body.newpw = bcrypt.hashSync(req.body.newpw, 10);
    account.set({ password: req.body.newpw });
    var result = await account.save();
    res.send(result);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/account/tracking', function (req, res) {
  var email = 'rapsunl231@gmail.com';
  try {
    Tracking.find({ email: email }, function (err, docs) {
      res.render('product/trackingPage', {
        listTracking: docs,
      });
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/order/:id', function (req, res) {
  try {
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/history', async (req, res) => {
  try {
    var account = await Account.findOne({ _id: req.body.id }).exec();
    var checkTracking = await Tracking.find({ email: account['email'] }).exec();
    res.send(checkTracking);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post(
  '/shop/payment/joingb',
  TokenUserCheckMiddleware,
  async (req, res) => {
    var uemail = req.decoded['email'];
    try {
      var account = await Account.findOne({ email: uemail }).exec();
      var checkProduct = await Product.find(
        { product_id: req.body.product_id },
        { category_id: 'ETC2' }
      ).exec();
      await Couter.findOne({ _id: 'tracking' }, function (err, docs) {
        db.collection('trackings').insertOne({
          order_id: 'ORD00' + (docs['seq'] + 1),
          email: uemail,
          list_product: {
            _id: new mongoose.Types.ObjectId().toString(),
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
        });
        db.collection('couters').findAndModify(
          {
            _id: 'tracking',
          },
          {},
          { $inc: { seq: 1 } },
          { new: true, upsert: true },

          function (err, docs) {}
        );
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

// --------------------------------- PRODUCT CONFIG --------------------------------------------
router.get('/shop/product/:id', async (req, res) => {
  try {
    Product.find(
      { category_url_name: req.params.id },
      function (err, products) {
        if (products[0]) {
          Category.findOne(
            { category_id: products[0].category_id },
            function (err, categories) {
              if (req.session.User == null) {
                res.render('product/detailsProduct', {
                  user: null,
                  userName: null,
                  detailsProduct: products,
                  Category: categories,
                  currentPage: 'Shop',
                });
              } else {
                Account.findOne(
                  { email: req.session.User['email'] },
                  function (errAccount, getAccount) {
                    res.render('product/detailsProduct', {
                      user: req.session.User['email'],
                      userName: getAccount.fname + ' ' + getAccount.lname,
                      detailsProduct: products,
                      Category: categories,
                      currentPage: 'Shop',
                    });
                  }
                );
              }
            }
          );
        } else {
          res.redirect('/404Page');
        }
      }
    );
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/shop/payment/:id', async (req, res) => {
  try {
    Product.find(
      { category_url_name: req.params.id },
      function (errdocs, docs) {
        if (docs[0]) {
          Category.findOne(
            { category_id: docs[0].category_id },
            function (errdocs2, docs2) {
              Account.findOne(
                { email: 'rapsunl231@gmail.com' },
                function (erruser, docs3) {
                  res.render('product/joingbPage', {
                    // res.render('product/cartPage', {
                    title: 'Payment',
                    User: docs3,
                    Payment: docs,
                    Category: docs2,
                  });
                }
              );
            }
          );
        } else {
          res.redirect('/404Page');
        }
      }
    );
    // res.render('product/cartPage', {
    //   title: 'Payment',
    // });
  } catch (err) {
    res.status(200).send(err);
  }
  // res.render('product/cart', {
  //   title: 'Cart',
  //   currentPage: 'Cart',
  // });
});

router.get('/cart', (req, res) => {
  try {
    if (!req.session.User) {
      res.render('product/cart', {
        user: null,
        title: 'Cart',
        currentPage: 'Cart',
        // async: true,
      });
    } else {
      Account.findOne(
        { email: req.session.User['email'] },
        function (_, account) {
          res.render('product/cart', {
            user: account,
            title: 'Cart',
            currentPage: 'Cart',
            // async: true,
          });
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
});

router.get('/cart/delivery-information', async (req, res) => {
  try {
    const moneyRate = await MoneyRate.find({}).exec();
    // const paymentMethod = [];
    if (req.session.User == null) {
      res.render('product/cartPayment', {
        user: null,
        title: 'Payment',
        currentPage: 'Payment',
        moneyRate: moneyRate.reduce((a, v) => ({ ...a, [v]: v })),
      });
    } else {
      Account.findOne(
        { email: req.session.User['email'] },
        function (errAccount, account) {
          res.render('product/cartPayment', {
            user: account,
            title: 'Payment',
            currentPage: 'Payment',
            moneyRate: moneyRate.reduce((a, v) => ({ ...a, [v]: v })),
          });
        }
      );
    }
  } catch (err) {
    console.log(err);
  }
});

router.post('/cart/add', async (req, res) => {
  let currentStorage = localStorage.getItem('cart');
  const hanldeProductType = (type) => {
    let typeLabel = '';
    switch (type) {
      case 0:
        typeLabel = 'Keyboard top case';
        break;
      case 1:
        typeLabel = 'Keyboard bottom case';
        break;
      case 2:
        typeLabel = 'Keyboard plate';
        break;
      case 3:
        typeLabel = 'Keyboard frame';
        break;
      case 4:
        typeLabel = 'Keyset';
        break;
      case 5:
        typeLabel = 'Switch pack';
        break;
      case 6:
        typeLabel = 'Not defined';
        break;
      case 7:
        typeLabel = 'Artisan';
        break;
      case 8:
        typeLabel = 'Accesssories';
        break;
    }
    return typeLabel;
  };
  try {
    if (!req.session.User) {
      res.json({ message: 'Please login first!', flag: 407 });
    } else if (req.body) {
      Product.find(
        { product_id: req.body.product_id },
        function (errdocs, products) {
          if (products) {
            let newItem = {
              product_id: products[0].product_id,
              product_image: products[0].pic_product.path,
              product_name: products[0].product_name,
              product_quantity: Number(req.body.product_quantity),
              product_price: Number(products[0].price),
              product_type: hanldeProductType(products[0].product_part),
              product_url: products[0].category_url_name,
            };
            const cartLength = JSON.parse(localStorage.getItem('cart')).length;
            // const cartLength = JSON.parse(req.body.cart).length
            if (cartLength > 0) {
              let currentCart = JSON.parse(localStorage.getItem('cart'));
              // let currentCart = JSON.parse(req.body.cart)
              const isAlready = currentCart.findIndex(
                (item) => item.product_id == newItem.product_id
              );
              console.log('is', isAlready);
              if (isAlready == -1) {
                currentCart.push(newItem);
                localStorage.setItem('cart', JSON.stringify(currentCart));
              } else {
                currentCart[isAlready].product_quantity +=
                  newItem.product_quantity;
                localStorage.setItem('cart', JSON.stringify(currentCart));
              }
              res.json({ message: 'Item Added', flag: 200 });
              // res.json({message: 'Added', flag: 200, data: JSON.stringify(currentCart)})
            } else {
              localStorage.setItem('cart', JSON.stringify([newItem]));
              res.json({ message: 'Added', flag: 200 });
              // res.json({message: 'Added', flag: 200, data: JSON.stringify([newItem])})
            }
          }
        }
      );
    }
  } catch (err) {
    res.json({ message: err, flag: 500 });
  }
});

router.post('/cart/remove-item', async (req, res) => {
  const cartLength = JSON.parse(localStorage.getItem('cart')).length;
  if (req.body && cartLength > 0) {
    let currentCart = JSON.parse(localStorage.getItem('cart'));
    const isAlready = currentCart.findIndex(
      (item) => item.product_id == req.body.product_id
    );
    if (isAlready != -1) {
      await localStorage.setItem(
        'cart',
        JSON.stringify(
          currentCart.filter((item) => item.product_id !== req.body.product_id)
        )
      );
    } else {
      res.json({ message: 'something wrong !', flag: 500 });
    }
    res.json({
      message: 'Added',
      flag: 200,
      data: localStorage.getItem('cart'),
    });
  }
});
router.get('/cart/get', (req, res) => {
  try {
    const currentCart = JSON.parse(localStorage.getItem('cart'));
    res.json({ message: 'Success', flag: 200, data: currentCart });
  } catch (err) {
    res.json({ message: err.message, flag: 500 });
  }
});
router.post('/cart/update', async (req, res) => {
  try {
    const currentCart = JSON.parse(localStorage.getItem('cart'));
    const dataReq = req.body.newQuantityArr;
    console.log(dataReq);
    for (let i in currentCart) {
      currentCart[i].product_quantity = parseInt(dataReq[i], 10);
      await localStorage.setItem('cart', JSON.stringify(currentCart));
    }
    res.json({ message: 'Update success', flag: 200 });
  } catch (err) {
    res.josn({ message: 'something wrong', flag: 500 });
  }
});

router.get('/cart/payment', async (req, res) => {
  const moneyRate = await MoneyRate.find({}).exec();
  res.render('product/payment', {
    user: null,
    title: 'Payment',
    currentPage: 'Payment',
    currencyCharge: moneyRate.reduce((prev, curr) => ({
      ...prev,
      [curr]: curr,
    })),
  });
});
// ==================================================================== //
router.get('/service', TokenUserCheckMiddleware, (req, res) => {
  if (req.session.User == null) {
    res.redirect('/register');
  } else {
    Account.findOne(
      { email: req.session.User['email'] },
      function (errAccount, getAccount) {
        res.render('product/servicePage', {
          user: req.session.User['email'],
          userName: getAccount.fname + ' ' + getAccount.lname,
          title: 'Keyboard Service',
          lubeTitle: 'Lube Service Form',
          assemTitle: 'Assembled Service Form',
          currentPage: 'Service',
        });
      }
    );
  }
});
router.post('/service/invoice', TokenUserCheckMiddleware, async (req, res) => {
  var customUrl = req.protocol + '://' + req.get('host') + '/invoice/';
  try {
    await Couter.findOne({ _id: 'service_invoice' }, function (err, docs) {
      function generateInvoice(invoice, filename, success, error) {
        var postData = JSON.stringify(invoice);
        var options = {
          hostname: 'invoice-generator.com',
          port: 443,
          path: '/',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
          },
        };
        var file = fs.createWriteStream('./invoice/' + filename);
        var url = customUrl + filename;
        var req = https.request(options, function (res) {
          res
            .on('data', function (chunk) {
              file.write(chunk);
            })
            .on('end', function () {
              file.end();

              if (typeof success === 'function') {
                success();
              }
            });
        });
        var filePath = path.join(__dirname, '..', 'invoice', filename);
        req.write(postData);
        req.end();
        db.collection('invoices').insertOne({
          invoice_id: 'INV-' + (docs['seq'] + 1),
          invoice_details: {
            path: file,
          },
          note: '',
        });

        var stat = fs.statSync('./invoice/' + filename);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=agreement.pdf'
        );
        res.status(200).json({
          data: url,
          file: filename,
        });

        if (typeof error === 'function') {
          req.on('error', error);
        } else {
        }
      }

      const assem_service = 'Assembled Service';
      const lube_service = 'Lube Service';
      const buy_service = 'Buy Accesssories';
      const price_film = 150000;
      const price_spring = 180000;
      var lube_service_with_accessories = 6000;
      var lube_service_without_accessories = 5000;
      var price_lube_service = 0;
      var items = [];
      var description_film, description_spring, description_grease;
      var replaceFilm, replaceSpring, replaceGrease;

      if (req.body.film_color) {
        replaceFilm =
          req.body.film_color.replace(/_/g, ' ').charAt(0).toUpperCase() +
          req.body.film_color.replace(/_/g, ' ').slice(1);

        items.push({
          name: buy_service + ' - ' + 'Tx Film' + ' ' + replaceFilm,
          quantity: 1,
          unit_cost: parseInt(req.body.price_bill['price_film']),
          description: '- 1 Pack Tx Film' + ' ' + replaceFilm,
        });
        description_film = '\n - Film Tx' + ' ' + replaceFilm;
      }
      if (req.body.spring_force) {
        replaceSpring =
          req.body.spring_force.replace(/_/g, ' ').charAt(0).toUpperCase() +
          req.body.spring_force.replace(/_/g, ' ').slice(1);
        items.push({
          name: buy_service + ' - ' + 'Springs' + ' ' + replaceSpring + 'cn',
          quantity: 1,
          unit_cost: parseInt(req.body.price_bill['price_spring']),
          description: '- 1 Pack Springs' + ' ' + replaceSpring + 'cn',
        });
      }
      if (req.body.grease) {
        description_grease =
          req.body.grease.replace(/_/g, ' ').charAt(0).toUpperCase() +
          req.body.grease.replace(/_/g, ' ').slice(1);
      }
      if (req.body.switches_quanity) {
        items.push({
          name:
            lube_service +
            ' - ' +
            req.body.switch_type +
            ' x' +
            req.body.switches_quanity,
          quantity: 1,
          unit_cost: parseInt(
            req.body.price_bill['lube_service_price_without_accesscories']
          ),
          description:
            '- Housing/Stem w/' +
            ' ' +
            description_grease +
            description_film +
            '\n - Spring w/ GPL 105',
        });
      }

      var invoice = {
        logo: 'https://drive.google.com/uc?export=view&id=1jtFwxaDyazQeytgNhsfqsXhGTFS5s-wG',
        from: 'NoobStore\noobassembly@gmail.com\nalley 4, 10 st, Hiep Binh Chanh ward, Thu Duc district\nHo Chi Minh, Vietnam 700000',
        to: 'Guest',
        currency: 'vnd',
        number: 'INV-' + (docs['seq'] + 1),
        payment_terms: 'Auto-Billed - Do Not Pay',
        due_date: moment().add(1, 'M').format('MMM DD, YYYY'),
        items: items,
        fields: {
          tax: '%',
          discounts: true,
          shipping: true,
        },
        discounts: 0,
        shipping: 0,
        tax: 0,
        amount_paid: 0,
        notes: 'Thanks for being an awesome customer!',
        terms:
          'No need to submit payment. You will be auto-billed for this invoice.',
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
      generateInvoice(
        invoice,
        new Date().toISOString().replace(/:/g, '-') + invoice.number + '.pdf',
        function () {},
        function (error) {
          console.error(error);
        }
      );
    });
    db.collection('couters').findAndModify(
      {
        _id: 'service_invoice',
      },
      {},
      { $inc: { seq: 1 } },
      { new: true, upsert: true },
      function (err, docs) {}
    );
  } catch (err) {
    res.status(200).send(err);
  }
});

//Blogs

router.get('/blogs', function (req, res) {
  BlogCategory.find({}, function (err, docsCategory) {
    BlogPost.find({}, function (errPost, docsPost) {
      res.render('blog/indexPage', {
        title: 'Blog',
        listBlogCategory: docsCategory,
        listBlogPost: docsPost,
      });
    });
  });
});

router.get('/blogs/create', function (req, res) {
  res.render('blog/createPage');
});

// Contact

router.get('/contact', (req, res) => {
  res.render('product/contactPage');
});

router.post('/contact/create', async (req, res) => {
  var email = req.body.mail;
  var name = req.body.name;
  var message = req.body.message;
  try {
    if (email !== '' && name !== '') {
      await db.collection('contacts').insertOne({
        name: name,
        mail: email,
        message: message,
      });
      res.send({
        success: true,
        status: 200,
        message: 'Thanks for your contact. We will reponse ASAP',
      });
    }
  } catch (err) {
    res.status(404).send({ success: false, error: { message: err } });
  }
});

// test drawCanvas

router.get('/drawCanvas', function (req, res) {
  res.render('drawCanvas/view/draw');
});

router.get('/fake_parent_select2', function (req, res) {
  res.send([
    { id: 1, name: 'Region 1' },
    { id: 2, name: 'Region 2' },
  ]);
});
router.get('/fake_parent_select2/:id', function (req, res) {
  if (req.params.id == 1) {
    res.send({
      results: [
        {
          id: 1,
          text: 'Zone 1',
        },
        {
          id: 2,
          text: 'Zone 2',
        },
      ],
      pagination: {
        more: true,
      },
    });
  } else {
    res.send({
      results: [
        {
          id: 3,
          text: 'Zone 3',
        },
        {
          id: 4,
          text: 'Zone 4',
        },
      ],
      pagination: {
        more: true,
      },
    });
  }
});

// ---------------------------------------------------------------------------------------------

router.get('*', function (req, res) {
  res.status(404).render('404Page');
});

module.exports = router;
