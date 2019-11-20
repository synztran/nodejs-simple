//NOTE
// If you change anything in index.js that you must re-run in cmd

/*Call for using express*/
var express = require("express");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var http = require('http');
const uri = "'mongodb+srv://admin:root@cluster0-u7ysm.mongodb.net/test?retryWrites=true&w=majority', {dbName: 'testmongodb'}"
var port = process.env.PORT || 5000;
// var router = express.Router();
var Database = require('./db/database');
var routes = require('./routes/controller');
var bcrypt = require("bcryptjs");
// mongoose.connect('mongodb://localhost:27017/testmongodb');
// mongoose.connect('mongodb+srv://admin:root@cluster0-u7ysm.mongodb.net/test?retryWrites=true&w=majority', {dbName: 'testmongodb'});
// var date = new Date();


// Create object
var app = express();
var server = http.Server(app)
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

app.use('/', routes);
// working on port 3000
// app.listen(3000);
server.listen(port, function(){
	console.log("Example app listening on port !" + port);
})
// http.createServer(function(req,res){
// 	res.writeHead(200, {"Content-Type": "text/plain"})
// 	// res.end("Hello World\n")
// }).listen(port)

// ----=======meaning/define page url

// app.get("/", function(req, res)  {
//     res.render("homePage");
// });

// app.get("/test", function(req, res)  {
//     res.render("testPage");
// });

// app.get("/signup", function(req, res){
// 	res.render("registerPage");
// });

// app.get("/success", function(req,res){

// 	res.render("successPage");
// });

// -----------------====VALIDATE

// -----------------=====Define REST Application



// app.post("/signup", function(req,res){
// 	var email = req.body.email;
// 	var password = req.body.password;

// 	var data = {
// 		"email": email,
// 		"password": password
// 	}

// 	db.collection('users').insertOne(data, function(err,collection){
// 		if(err) throw err;
// 		console.log("successfully");
// 	});
// 	return res.redirect('success');
// })


// app.get("/people", async (req, res) => {
// 	var resultArray = [];
//         try {
//             var result = await Account.find().exec();
//             res.send(result);
//             resultArray.push(result);
//         } catch (err) {
//             res.status(500).send(err);

//         }
//     console.log(resultArray);
//     });



// app.get("/person/:id", async(req, res) =>{
// 	console.log(req.params);
// 	try{
// 		var account = await Account.findById(req.params.id).exec();
// 		res.send(account);
// 	}catch(err){
// 		res.status(500).send(err);
// 	}
// });

// app.put("/person/:id", async(req, res) =>{
// 	try{
// 		console.log(req.params);
// 		console.log(req.body);
// 		var account = await Account.findById(req.params
// 			.id).exec();
// 		account.set(req.body);
// 		var result = await account.save();
// 		res.send(result);

// 	}catch(err){
// 		console.log(err);
// 		res.status(200).send(err);
// 	}
// });

// app.get("/created", async(req, res) =>{
// 	var date = new Date();
// 	var datecreated = req.body.created;
// 	var todayStart = new Date(datecreated);
// 	var todayEnd = new Date(datecreated);
// 	todayEnd.setHours(23);
// 	todayEnd.setMinutes(59);
// 	todayEnd.setSeconds(59);
// 	todayEnd.setMilliseconds(999);

// 	console.log("start " + todayStart.toISOString());
// 	console.log("end " + todayEnd.toISOString());
		
// 	try{
// 		// var account = await Account.find({"created": ISODate(datecreated)}).exec();
// 		var result = await Account.find( {created: {$gte: (todayStart), $lte: todayEnd} });
// 		res.send({
// 			"date": req.body,
// 			"startDate": todayStart,
// 			"endDate" : todayEnd,	
// 			"count": result.length,
// 			result});
// 	}catch(err){
// 		res.status(200).send(err);
// 	}
// });

// app.delete("/person/:id", async(req, res) =>{
// 	try{
// 		var result = await Account.deleteOne({_id: req.params.id}).exec();
// 		res.send(result);
// 	}catch(err){
// 		res.status(500).send(err);
// 	}
// });

// // -----------------------------------
// /*---------------------------------------------*/

// app.post("/signup", function(req,res){
// 	var email = req.body.email;
// 	var password = req.body.password;

// 	var data = {
// 		"email": email,
// 		"password": password
// 	}

// 	db.collection('users').insertOne(data, function(err,collection){
// 		if(err) throw err;
// 		console.log("successfully");
// 	});
// 	return res.redirect('success');
// })
// app.post("/login", async(req, res) =>{
// 	console.log(req.body);
// 	try{
// 		var account = await Account.findOne({ email: req.body.email}).exec();
// 		// console.log(req.body.email);
// 		if(!account) {
// 			return res.status(400).send({
// 				status: "error",
// 				message: "The user does not exist "
// 			});
// 		}
		
// 		if(!bcrypt.compareSync(req.body.password, account.password)){
// 			return res.status(400).send({
// 				status: "error",
// 				message: "The password is not correct"
// 			});
// 		}
// 		// res.send({
// 		// 	status: "success",
// 		// 	message: "The email & password combination is correct!"
// 		// });
// 		 res.redirect('success');
// 	}catch(err){
// 		res.status(500).send(err);
// 	}
// });

// app.post("/register", async(req,res) =>{
// 	try{
// 		var check = await Account.find({email: req.body.email}, async(err,docs)=>{
// 			if(docs.length){
// 				res.status(400).send({
// 					code: 400,
// 					message: "email already exists"
// 				})
// 			}else{
// 				req.body.password = bcrypt.hashSync(req.body.password, 10);
// 				var account = new Account(req.body);
// 				var result = await account.save();
// 				res.send(result);
// 			}
// 		}).exec();
// 	}catch(err){
// 		res.status(500).send(err)
// 	}
// })


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
        default: (new Date()).toJSON().slice(0, 19).replace(/[-T]/g, ':')
     }
 });



const User = mongoose.model('User', userSchema);


/*-----------------EXPORT-----------------------*/
// exports.user = User;
// exports.account = Account;
module.exports = {
	app: express()
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