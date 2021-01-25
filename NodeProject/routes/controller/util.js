
const express = require('express');
const router = express.Router();
const path = require('path')
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const app = express();
const i18n = require("i18n")

var mongoose = require('mongoose');
var db = mongoose.connection;

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
var Account = require('./../../db/model/account');
var AdmAccount = require('./../../db/model/accadmin');
// example = require('./../lib/js/listAccount.js')

async function changelang(req, res){
    console.log(req.params.lang)
    res.cookie('lang', req.params.lang, {maxAge: 900000});
    res.redirect('back');
}

async function signin(req, res){
    res.render("homePage");
};

// router.get("/nhomepage", function(req, res) {
//     res.render("manager/adminPage");
// });

async function test(req, res){
    res.render("testPage");
};

async function signupGet(req, res){
    res.render("registerPage");
};

async function tokencheck(req, res){
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
    

};

async function messenger(req, res) {
    res.render('messengerPage');
}

async function listroom(req, res){
    res.render('listroomPage');
}

async function listcreated(req, res){
    res.render('listCreated', {
        // 'listCreated' : ''
    });
}


async function success(req, res){

    res.render("successPage");

};

async function signupPost(req, res){
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
}

async function list(req, res) {
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
    
  
    

};

async function Delete(req, res){
    try {
        var result = await AdmAccount.deleteOne({ _id: req.params.id }).exec();
        res.send(result);

    } catch (err) {
        res.status(500).send(err);
    }
};

async function people(req, res){
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
};

async function person(req, res){
    console.log(req.params);
    try {
        var account = await Account.findById(req.params.id).exec();
        res.send(account);
    } catch (err) {
        res.status(500).send(err);
    }
};

module.exports = {changelang, signin, test, signupGet, tokencheck, messenger, listroom, listcreated, success, signupPost, list, Delete, people, person};
