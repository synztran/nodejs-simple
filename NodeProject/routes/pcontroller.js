const express = require('express');
const router = express.Router();
const req = require('request');
const bcrypt = require("bcryptjs");
const fs = require('fs');
const readline = require('readline');
const jwt = require('jsonwebtoken');
const reqHeader = require('request');
const nodemailer = require('nodemailer');
const config = require('./../lib/comon/config');
const utils = require('./../lib/comon/utils');
const cookieParser = require('cookie-parser'); 
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
var Image = require('./../db/model/image');
var userToken = require('./../db/model/token');
var TokenCheckMiddleware = require('./../lib/check/checktoken');
example = require('./../lib/js/listAccount.js')





router.get("/", function(req, res) {
    const uemail = req.cookies['x-email'];
    res.render('index'
    ,{
        user:  uemail  
    })
});

router.post("/register", async (req, res, next) => {
    

    // console.log(req);
    // console.log(req.body.fileuploader-list-picture);
    console.log(req.body);
    try {
        var check =  await  Account.find({ email: req.body.email }, async (err, docs) => {
            if (docs.length) {
                res.status(400).json({
                    code: 400,
                    message: "email already exists"
                })
            } else {
                req.body.password = bcrypt.hashSync(req.body.password, 10);
                var account = await new Account({
                    fname: req.body.fname,
                    lname: req.body.lname,
                    email: req.body.email,
                    password: req.body.password,
                    // picture: {
                    //     path: req.file.path,
                    //     size: req.file.size
                    // },
                    active: false
                });
                var result =  account.save();
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth:{
                        user: 'noobassembly@gmail.com',
                        pass: '123456Ban'
                    }
                });
                var mainOptions = {
                    from: 'NoobTeam',
                    to: req.body.email,
                    subject: 'Active account',
                    text: 'You received mess from ' + req.body.email,
                    html: '<p style="font-size: 32px;line-heigth: 18px;border-bottom: 1px solid silver"><b>Thanks for your register!!!</b><p>Click to link below to actived your account. Thanks</p>'
                }

                transporter.sendMail(mainOptions, function(err, info){
                    console.log(info)
                    if(err) {
                        console.log(err);
                        res.redirect('/');
                    }else {console.log('Mess sent: ' + info.response);
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

router.post("/login", async (req, res, next) => {
    try {
        var account = await Account.findOne({ email: req.body.email }).exec();
        var active =  await Account.findOne({ $and:[{email: req.body.email}, {active: true}]});
       
        
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
        var check =  userToken.find({ email: req.body.email }, async (err, docs) => {
            if (docs.length) {
                // userToken.set(req.body);
                db.collection('usertokens').updateOne({email: req.body.email}, {$set:{token: response.token, refreshToken: response.refreshToken}})
            } else {
                var accToken = new userToken({
                    email: req.body.email,
                    token: response.token,
                    refreshToken: response.refreshToken
                });
                var result =  accToken.save();
            }
        }).exec();
       
            res.cookie('x-token', response.token);
            res.cookie('x-refresh-token', response.refreshToken);
            res.cookie('x-email', user.email);
            // res.send(token);
           
            res.redirect('/');
            
        
    } catch (err) {
        res.status(500).send(err);
    }
});


router.post('/updatepassword', async(req, res)=>{
    // console.log(req.body);
    const uemail = req.cookies['x-email'];
    // console.log(uemail)
    try{
        var account = await Account.findOne({email: uemail}).exec();
        // console.log(account);
        if (!bcrypt.compareSync(req.body.currentpw, account.password)) {
            return res.status(400).send({
                status: "error",
                message: "The password is not correct"
            });
        }
        req.body.newpw = bcrypt.hashSync(req.body.newpw, 10);
        account.set({password: req.body.newpw});
        var result = await account.save();
        res.send(result)

    }catch(err){
        res.status(500).send(err);

    }
})





module.exports = router;