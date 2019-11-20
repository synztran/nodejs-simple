var express = require('express');
var router = express.Router();
var bcrypt = require("bcryptjs");
var Account = require('./../db/model/account');

router.get("/", function(req, res)  {
    res.render("homePage");
});

router.get("/test", function(req, res)  {
    res.render("testPage");
});

router.get("/signup", function(req, res){
    res.render("registerPage");
});

router.get("/success", function(req,res){

    res.render("successPage");
});

router.post("/signup", function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    var data = {
        "email": email,
        "password": password
    }

    db.collection('users').insertOne(data, function(err,collection){
        if(err) throw err;
        console.log("successfully");
    });
    return res.redirect('success');
})

router.get('/', (req, res) => {
    Account.find({})
        .then(accounts => {
            res.render('homePage', { accounts: accounts })
        })
        .catch(err => {
            console.log('Error: ', err);
            throw err;
        })
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



router.get("/person/:id", async(req, res) =>{
    console.log(req.params);
    try{
        var account = await Account.findById(req.params.id).exec();
        res.send(account);
    }catch(err){
        res.status(500).send(err);
    }
});

router.put("/person/:id", async(req, res) =>{
    try{
        console.log(req.params);
        console.log(req.body);
        var account = await Account.findById(req.params
            .id).exec();
        account.set(req.body);
        var result = await account.save();
        res.send(result);

    }catch(err){
        console.log(err);
        res.status(200).send(err);
    }
});

router.get("/created", async(req, res) =>{
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
        
    try{
        // var account = await Account.find({"created": ISODate(datecreated)}).exec();
        var result = await Account.find( {created: {$gte: (todayStart), $lte: todayEnd} });
        res.send({
            "date": req.body,
            "startDate": todayStart,
            "endDate" : todayEnd,   
            "count": result.length,
            result});
    }catch(err){
        res.status(200).send(err);
    }
});

router.delete("/person/:id", async(req, res) =>{
    try{
        var result = await Account.deleteOne({_id: req.params.id}).exec();
        res.send(result);
    }catch(err){
        res.status(500).send(err);
    }
});

// -----------------------------------
/*---------------------------------------------*/

router.post("/signup", function(req,res){
    var email = req.body.email;
    var password = req.body.password;

    var data = {
        "email": email,
        "password": password
    }

    db.collection('users').insertOne(data, function(err,collection){
        if(err) throw err;
        console.log("successfully");
    });
    return res.redirect('success');
})
router.post("/login", async(req, res) =>{
    console.log(req.body);
    try{
        var account = await Account.findOne({ email: req.body.email}).exec();
        // console.log(req.body.email);
        if(!account) {
            return res.status(400).send({
                status: "error",
                message: "The user does not exist "
            });
        }
        
        if(!bcrypt.compareSync(req.body.password, account.password)){
            return res.status(400).send({
                status: "error",
                message: "The password is not correct"
            });
        }
        // res.send({
        //  status: "success",
        //  message: "The email & password combination is correct!"
        // });
         res.redirect('success');
    }catch(err){
        res.status(500).send(err);
    }
});

router.post("/register", async(req,res) =>{
    try{
        var check = await Account.find({email: req.body.email}, async(err,docs)=>{
            if(docs.length){
                res.status(400).send({
                    code: 400,
                    message: "email already exists"
                })
            }else{
                req.body.password = bcrypt.hashSync(req.body.password, 10);
                var account = new Account(req.body);
                var result = await account.save();
                res.send(result);
            }
        }).exec();
    }catch(err){
        res.status(500).send(err)
    }
})

module.exports = router;