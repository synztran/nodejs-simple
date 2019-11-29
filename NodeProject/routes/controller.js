var express = require('express');
var router = express.Router();
var req = require('request');
var bcrypt = require("bcryptjs");
var fs = require('fs');
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
example = require('./../lib/js/listAccount.js')

// init
router.get("/", function(req, res) {
    res.render("homePage");
});

router.get("/test", function(req, res) {
    res.render("testPage");
});

router.get("/signup", function(req, res) {
    res.render("registerPage");
});

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

router.get('/list', function(req, res) {

  


    Account.find({}, function(err, docs) {
        res.render('listAccount', {
            "listAccount": docs
        });
    });
    // Account.find({}), function(er, docs){
    //     if(err) res.json(err);
    //     else res.render('homePage', {Accounts: docs})
    // }

});




router.delete("/delete/:id", async (req, res) => {
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
        res.send(result);
        resultArray.push(result);
    } catch (err) {
        res.status(500).send(err);

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

router.get("/created", async (req, res) => {
    var date = new Date();
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
        var result = await Account.find({ created: { $gte: (todayStart), $lte: todayEnd } });
        res.send({
            "date": req.body,
            "startDate": todayStart,
            "endDate": todayEnd,
            "count": result.length,
            result,

        });
    } catch (err) {
        res.status(200).send(err);
    }
});



// -----------------------------------
/*---------------------------------------------*/

// router.post("/signup", function(req, res) {
//     var email = req.body.email;
//     var password = req.body.password;

//     var data = {
//         "email": email,
//         "password": password
//     }

//     db.collection('accounts').insertOne(data, function(err, collection) {
//         if (err) throw err;
//         console.log("successfully");
//     });
//     return res.redirect('success');
// })
router.post("/login", async (req, res) => {
    console.log(req.body);
    try {
        var account = await Account.findOne({ email: req.body.email }).exec();
        // console.log(req.body.email);
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

        res.redirect('success');
        
    } catch (err) {
        res.status(500).send(err);
    }
});

router.post("/register", upload.single('picture'),  (req, res) => {
    console.log(req.file)
    console.log(req.body);
    // const account = new Account({
    //     email: req.body.email,
    //     password: bcrypt.hashSync(req.body.password, 10),
    //     picture: req.file.path
    // });
    try {
        var check =  Account.find({ email: req.body.email }, async (err, docs) => {
            if (docs.length) {
                res.status(400).send({
                    code: 400,
                    message: "email already exists"
                })
            } else {
                req.body.password = bcrypt.hashSync(req.body.password, 10);
                // req.body.picture = fs.readFileSync(req.files.userPhoto.path)
                // var account = new Account({email: req.body.email, password : req.body.password, picture : req.file.path});
                var account = new Account({
                    email: req.body.email,
                    password: req.body.password,
                    picture: {
                        path: req.file.path,
                        size: req.file.size
                    }
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
module.exports = router;