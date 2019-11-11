//NOTE
// If you change anything in index.js that you must re-run in cmd

/*Call for using express*/
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testmongodb');

// Create object
var app = express();
var db = mongoose.connection;

// Check connection of db
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 
    extended: true
})); 
// set static data for public folder to Application Server
app.use(express.static("public"));

// using libary ejs, ejs create html then back to browser
app.set("view engine", "ejs");

// url of view folder to Application Server
app.set("views", "./views");

// working on port 3000
app.listen(3000);

// ----=======meaning/define page url
app.get("/", function(req, res)  {

    res.render("homePage");
});

app.get("/test", function(req, res)  {

    res.render("testPage");
});

app.get("/signup", function(req, res){
	res.render("registerPage");
});

app.get("/success", function(req,res){

	res.render("successPage");
});

// -----------------====VALIDATE
var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

// -----------------=====Define REST Application

app.post("/person", async(req, res) =>{
	try{
		var account = new Account(req.body);
		var result = await account.save();
		res.send(result);
	}catch(err) {
		res.status(500).send(err);
	}
});

app.get("/people", async (req, res) => {
        try {
            var result = await Account.find().exec();
            res.send(result);
        } catch (err) {
            res.status(500).send(err);

        }
    });


app.get("/person/:id", async(req, res) =>{
	try{
		var account = await Account.findById(res.params.id).exec();
		res.send(account);
	}catch(err){
		res.status(500).send(err);
	}
});

app.put("/person/:id", async(req, res) =>{
	try{
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

app.delete("/person/:id", async(req, res) =>{
	try{
		var result = await Account.deleteOne({_id: req.params.id}).exec();
		res.send(result);
	}catch(err){
		res.status(500).send(err);
	}
});

// -----------------------------------
/*---------------------------------------------*/

app.post("/signup", function(req,res){
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

/*-------------STRUCTURE SCHEMA----------------*/
var userSchema = mongoose.Schema({
     name: {
            firstName: String,
        	lastName: String
    },
     email: String,
     profilePicture: Buffer,
     created: { 
        type: Date,
        default: Date.now
     }
 });

var accountSchema = mongoose.Schema({
	email: {
		type: String,
		lowercase: true,
		required: 'Email address is required',
		validate: [validateEmail, 'Please fill a valid email address'],
		match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
		// validate: {
		// 	validator: function(email){
		// 		var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
		// 		return emailRegex.test(email.text);
		// 	},
		// 	message: 'Email handle must have @'
		// }
	},
	password: String
})
const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);

/*-----------------EXPORT-----------------------*/
// exports.user = User;
// exports.account = Account;
module.exports = {
	app: express(),
	Account
}
/*----------------------------------------------*/
/*---------------------------------------------*/

/*--------------------MONGO DB-----------------*/
/*--------------------Create new DB------------*/

// ------=
/*Call for using mongodb*/
// var mongoose = require('mongoose');
// // create url for db
// mongoose.connect('mongodb://localhost:27017/testmongodb');

// var User = mongoose.model('User', {name: String, roles: Array, age:Number});

// var user1 = new User({name: 'modulus admin', age: 42, roles: ['admin', 'moderator', 'user']});
// user1.name = user1.name.toUpperCase();
// console.log(user1);

// //structure connect to mongodb
// user1.save(function(err, userObj){
// 	if(err){
// 		console.log(err);
// 	}else{
// 		console.log('saved successfully:', userObj);
// 	}
// })
//-------=

	/*---=Create db with Schema structure=---*/
	/*
	var aUser = new User({
		_id: new mongoose.Types.ObjectId(),
     	name: {
            firstName: 'mrs',
        	lastName: 'b'
	    },
	    email: 'abc@gmail.com',
	});
	aUser.save(function(err){
		if(err) throw err;
		
		console.log('successfully');
	})
	*/
	/*-------------------------------*/

/*--------------------------------------------*/



/*--------------------Update new DB------------*/

// User.findOne({
// 		"_id": "5dc4c8fc3f6eb32dd0b3b892"			
// 		},function(err,users){
// 			if(err){throw err;}
// 			users.email = null;
// 			users.name.firstName = null;
// 			users.save(function(err){
// 				if(err){ throw err;}
// 				console.log("successfully");
// 			})
// 		})




/*----------------------------------------------*/



/*----------------==Delete DB==----------------*/
// User.deleteOne({
// 	_id: "5dc51c18180ac02b7470223b"
// },function(err){
// 	if(err) throw err;
// })
// User.deleteOne({
// 	_id: "5dc51c4f5942b02f44725fee"
// },function(err){
// 	if(err) throw err;
// })
// User.deleteOne({
// 	_id: "5dc51ca9d125f0297829e614"
// },function(err){
// 	if(err) throw err;
// })
// User.deleteOne({
// 	_id: "5dc51d9ea1987b37b84d2426"
// },function(err){
// 	if(err) throw err;
// 	console.log("successfully");
// })


/*--------------------------------------------*/

/*------------==SEARCHING DB==--------------*/
		// User.find({
		// 	// email: "abc@gmail.com"
		// 	"name.firstName": "mrs"	
			
		// }).exec(function(err,users){
		// 	if(err) throw err;
		// 	console.log(users);
		// })
/*-------------------------------------*/