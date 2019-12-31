//NOTE
// If you change anything in index.js that you must re-run in cmd

/*Call for using express*/
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const http = require('http');
const fs = require('fs');

const uri = "'mongodb+srv://admin:root@cluster0-u7ysm.mongodb.net/test?retryWrites=true&w=majority', {dbName: 'testmongodb'}"
var port = process.env.PORT || 5000;
const methodOverride = require('method-override');

// var router = express.Router();
const Database = require('./db/database');
const routes = require('./routes/controller');
const bcrypt = require("bcryptjs");
// mongoose.connect('mongodb://localhost:27017/testmongodb');
// mongoose.connect('mongodb+srv://admin:root@cluster0-u7ysm.mongodb.net/test?retryWrites=true&w=majority', {dbName: 'testmongodb'});
// var date = new Date();


// Create object
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const db = mongoose.connection;
var date = new Date();

del = function(req, res){
	res.clearCookie('x-token');
	res.clearCookie('x-refresh-token');
	res.clearCookie('x-email');
	res.clearCookie('io');
	res.redirect('/signin');
}



// Check connection of db
db.on('error', console.log.bind(console, "connection error")); 
db.once('open', function(callback){ 
    console.log("connection succeeded"); 
}) 

app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ 
    extended: true
})); 
// app.use(express.cookieParser());
// set static data for public folder to Application Server
// app.use(express.static('public'));
// app.use(express.static('docs'));
app.use('/docs', express.static('docs'))
app.use('/js', express.static('lib/js'))
app.use('/css', express.static('lib/css'))
app.use('/io', express.static('lib'))
app.use('/docs/upload', express.static('docs/upload'))

// using libary ejs, ejs create html then back to browser
app.set("view engine", "ejs");

// url of view folder to Application Server
app.set("views", "./views");
app.get('/del', del);

app.use('/', routes);

// io.emit('some event', {someProperty: 'some value', otherProperty: 'other value'});

var numUsers = 0;

io.on('connection', function(socket){
	// socket.emit('chat message', { datetime: new Date().getTime() });
	console.log(socket.id)
	var online = 0;
	function GetCookieValue() {
		var regex = /%40/gi;
		var found = socket.handshake.headers.cookie.split(';').filter(c => c.trim().split("=")[0] === 'x-email');
		return found.length > 0 ? found[0].split("=")[1].replace(regex, '@') : null;
	}
	io.emit('this', {will: 'be received by everyone'});
	socket.on('private message', function(from, msg){
		console.log('Received private msg ', from, 'saying', msg);
	})

	io.emit('news', {name : GetCookieValue()});
	
	
	var addedUser = false;
	// socket receive from 1 client
	socket.on('load user name', function(username){
		if(addedUser) return false;
		++ numUsers;
		addedUser = true;
		console.log('user name: ' + username);
		socket.broadcast.emit('load user name', {
			username: GetCookieValue()
		})
	})

	socket.on('my other event', function(data){
		console.log(data);
	})

	socket.on('send_message', function(text) {
		console.log(socket.username);
		// gửi tin nhắn tới các client đang kết nối socket
		// ngoại trừ client đang kết nối (gửi tin nhắn)
		socket.broadcast.emit('receive_message', {
			username: socket.username,
			text: text
		});
	});

	socket.on('user_join', function(username) {
		if (addedUser)
			return false;
		socket.username = username;
		console.log('user_join: '+ socket.username);

		++ numUsers;
		addedUser = true;
		// báo cho client đang join phòng thành công
		socket.emit('login', {
			numberUsers: numUsers
		});
		// báo cho client khác biết có người mới join vào phòng
		socket.broadcast.emit('new_user_join', {
			username: socket.username,
			numUsers: numUsers
		});
	});

	socket.on('disconnect', function(){
		var username = GetCookieValue();
		// console.log('user disconnect');
		io.emit('disconnect', username + ' disconnected');
	})

	socket.on('typing', function(data){
		var username = GetCookieValue();
		// io.emit('typing', username);
		socket.broadcast.emit('typing', data, username)
	})

	
	
	socket.on('chat message', function(msg){
		// console.log('message: ' + msg);
		// console.log(GetCookieValue());
		
		var username = GetCookieValue();
		var id = socket.id 
		console.log("sedingmsg from " + id + ": " + msg);
		// socket.emit('datetime', { datetime: new Date()});
		// var regex = /%40/gi;
		// var username = namebfrp.replace(regex,'@')
		io.emit('chat message', msg, username, id, {datetime: new Date().getTime()});
	})

	socket.on('count', function(){
		online = online +1;
		console.log(online)
		io.emit('count', online)
	})

});




// working on port 3000
// app.listen(3000);
server.listen(port, function(){
	console.log("Example app listening on port !" + port);
})
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