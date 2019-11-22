var express = require('express');
var router = express.Router();
var req = require('request');
var bcrypt = require("bcryptjs");
var fs = require('fs');
const multer = require('multer');
var path = require('path');


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

    db.collection('users').insertOne(data, function(err, collection) {
        if (err) throw err;
        console.log("successfully");
    });
    return res.redirect('success');
})

router.get('/list', function(req, res) {

    // gfs.files.find({}).toArray((err, files)=>{
    //     if(!files || files.length === 0){
    //         res.render('listAccount', {files: false});
    //     }else{
    //         files.map(file =>{
    //             if(
    //                 file.contentType === 'image/jpeg' ||
    //                 file.contentType === 'image/png'
    //             ){
    //                 file.isImage = true;
    //             }else{
    //                 file.isImage = false;
    //             }
    //         });
    //         res.render('listAccount', {files: file});
    //     }
    // });


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


// router.post('/add_picture', upload.single('uploaded_file'), function(req, res) {

//     console.log(req.body);
//     console.log(req.file);
//     Account(req.file.path).save(function(err, data) {
//         if (err) throw err;
//         res.json(data);
//     })
// })

// req.get({ url: '/account/edit/:id', encoding: 'binary' }, function(err, response, body) {
//     fs.writeFile("./docs/", body, 'binary', function(err) {
//         if (err)
//             console.log(err);
//         else
//             console.log("The file was saved!");
//     });
// });


// update db to mongo
router.post("/account/edit/:id", async (req, res) => {
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

router.post("/signup", function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    var data = {
        "email": email,
        "password": password
    }

    db.collection('users').insertOne(data, function(err, collection) {
        if (err) throw err;
        console.log("successfully");
    });
    return res.redirect('success');
})
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

router.post("/register", async (req, res) => {
    try {
        var check = await Account.find({ email: req.body.email }, async (err, docs) => {
            if (docs.length) {
                res.status(400).send({
                    code: 400,
                    message: "email already exists"
                })
            } else {
                // req.body.password = bcrypt.hashSync(req.body.password, 10);
                // req.body.picture = fs.readFileSync(req.files.userPhoto.path)
                var account = new Account(req.body);
                var result = await account.save();
                res.send(result);
                // return res.redirect('success')
            }
        }).exec();
    } catch (err) {
        res.status(500).send(err)
    }
})


// var a = new Image;
// a.img.data = fs.readFileSync(imgPath);
// a.img.contentType = 'image/png';
// a.save(function(err, a){
//     if(err) throw err;
//     console.error('save img to mongo');
//     router.get('/add', function(req, res, next){
//         Image.findById(a, function(err, doc){
//             if(err) return next(err);
//             res.contentType(doc.img.contentType);
//             res.send(doc.img.data);
//         });
//     });
// });

// router.get('/docs/:filename', (req, res) => {
//     gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//         // Check if the input is a valid image or not
//         if (!file || file.length === 0) {
//             return res.status(404).json({
//                 err: 'No file exists'
//             });
//         }

//         // If the file exists then check whether it is an image
//         if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
//             // Read output to browser
//             const readstream = gfs.createReadStream(file.filename);
//             readstream.pipe(res);
//         } else {
//             res.status(404).json({
//                 err: 'Not an image'
//             });
//         }
//     });
// });


const getExtension = file => {
    if (file.mimetype == "image/jpeg")
        ext = ".jpeg"
    else
        ext = ".png"
    return ext;
}

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, '../docs/upload'))
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + getExtension(file))
    }
})
var upload = multer({ storage: storage })

router.post('/saveImage/', upload.single('file'), (req, res, next) => {
    if (req.file && req.file.mimetype != 'image/jpeg' && req.file.mimetype != 'image/png')
        return res.json({
            status: 1,
            message: "Please Choose JPG or PNG images"
        })
    if (req.file) {
        let image = "/images/" + req.file.filename
        res.json({
            status: 0,
            message: "Successfully saved",
            path: image
        })
    }
})





module.exports = router;