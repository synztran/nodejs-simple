//NOTE
// If you change anything in index.js that you must re-run in cmd

/*Call for using express*/
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const http = require('http');
const session = require('express-session');
const fileuploader = require('./lib/fileuploader/fileuploader');
// const redis = require('redis');
// const redisStore = require('connect-redis')(session);
// const client  = redis.createClient();
const livereload = require('connect-livereload');
// const fileuploader = require('fileuploader');
const config = require('./lib/comon/config');
const fs = require('fs');
const path = require('path')

const uri = "'mongodb+srv://admin:root@cluster0-u7ysm.mongodb.net/test?retryWrites=true&w=majority', {dbName: 'testmongodb'}"
var port = process.env.PORT || 80;
const methodOverride = require('method-override');

// var router = express.Router();
const Database = require('./db/database');
const routes = require('./routes/controller');
const proutes = require('./routes/pcontroller');
const bcrypt = require("bcryptjs");
const i18n = require("i18n")
const hbs = require('hbs')
const moment = require("moment");

// mongoose.connect('mongodb://localhost:27017/testmongodb');
// mongoose.connect('mongodb+srv://admin:root@cluster0-u7ysm.mongodb.net/test?retryWrites=true&w=majority', {dbName: 'testmongodb'});
// var date = new Date();

mongoose.set('useFindAndModify', false);
// Create object
const app = express();
const server = http.Server(app);
const io = require('socket.io')(server);
const db = mongoose.connection;
var date = new Date();
app.locals.moment = require('moment');

del = function(req, res){
	res.clearCookie('x-token');
	res.clearCookie('x-refresh-token');
	// res.clearCookie('uemail');
	// res.clearCookie('uid');
	res.clearCookie('io');
	req.session.destroy();
	// res.clearCookie();
	res.redirect('/api/signin');
	
}
hbs.registerHelper('__', function () {
   return i18n.__.apply(this, arguments);
});

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

app.use(session({
	saveUninitialized: false, 
	name: "mycookie",
	resave: false,
    secret: config.secret, 
    cookie: { 
		secure: false,
		maxAge: 1800000 
	},
	// store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),

}));






// app.use(livereload())
// app.use(express.cookieParser());
// set static data for public folder to Application Server
// app.use(express.static(__dirname + '/public'))
// app.set('views', path.join(__dirname, '/public'));
app.use('/api/docs', express.static('docs'))
app.use('/api/js', express.static('lib/js'))
app.use('/api/css', express.static('lib/css'))
// app.use('/api/io', express.static('lib'))
app.use('/package', express.static('lib'))
app.use('/api/docs/upload', express.static('docs/upload'))
app.use('/api/docs/trash', express.static('docs/trash'))
app.use('/product/img', express.static('docs/pimg'))
app.use('/product/css', express.static('lib/css/pcss'))
app.use('/nodemodules', express.static('node_modules'))
app.use('/favicon', express.static('favicon'))
app.use('/eventproduct', express.static('docs/pimg/portfolio/gallery/'))



// using libary ejs, ejs create html then back to browser
app.set("view engine", "ejs");

// url of view folder to Application Server
app.set("views", "./views");
//app.set("view", __dirname);
//app.set("view", path.join(__dirname, '../view'));
app.get('/del', del);


app.use('/api', routes);
app.use('/', proutes);



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

app.use(i18n.init);
// app.use(function(req, res, next){
// 	if (req.cookies.locale === undefined) {
// 	    res.cookie('locale', 'en', { maxAge: 900000, httpOnly: true });
// 	    req.setLocale('en');
// 	}
// 	next();
// })

// app.use('/change-lang/:lang', (req, res)=>{
//     res.cookie('lang', req.params.lang, {maxAge: 900000});
//     res.redirect('back');
// })
app.use((req, res, next) => {
  res.cookie('lang', req.params.lang, {maxAge: 900000});
  next();
});

// io.emit('some event', {someProperty: 'some value', otherProperty: 'other value'});

var numUsers = 0;
var rooms = ['abc123'];

io.on('connection', function(socket){
	// socket.emit('chat message', { datetime: new Date().getTime() });
	var cli = io.of('/api/messenger').clients();
	
	socket.on('get_rooms',function(){
		var room_list = {};
		var rooms = io.nsps['/messenger'].adapter.rooms;
  
		for (var room in rooms){
		  if (!rooms[room].hasOwnProperty(room)) {
				  console.log(rooms[room]);
				  room_list[room] = Object.keys(rooms[room]).length;
			  }
		}
		console.log(room_list);
		socket.emit('rooms_list',room_list);
	  });

	socket.on('getRoom', function(){
		var listroom = io.sockets.adapter.rooms;
		console.log(listroom)
		console.log(io.sockets.adapter.rooms)
		
		io.emit('getRoom', listroom)
		
	})

	var online = 0;
	function GetCookieValue() {
		var regex = /%40/gi;
		var found = socket.handshake.headers.cookie.split(';').filter(c => c.trim().split("=")[0] === 'x-email');
		return found.length > 0 ? found[0].split("=")[1].replace(regex, '@') : null;
	}

	function GetSession(){
		console.log(req.session.User)
	}

	


	io.emit('this', {will: 'be received by everyone'});
	socket.on('private message', function(from, msg){
		console.log('Received private msg ', from, 'saying', msg);
	});

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
	});

	socket.on('my other event', function(data){
		console.log(data);
	});

	socket.on('send_message', function(text) {
		console.log(socket.username);
		// gửi tin nhắn tới các client đang kết nối socket
		// ngoại trừ client đang kết nối (gửi tin nhắn)
		socket.broadcast.emit('receive_message', {
			username: socket.username,
			text: text
		});
	});

	socket.on('join_room', room => {
		socket.join(room);
	});

	socket.on('disconnect', function(){
		var username = GetCookieValue();
		// console.log('user disconnect');
		io.emit('disconnect', username + ' disconnected');
	});

	socket.on('typing', ({data, room}) =>{
		var username = GetCookieValue();
		// io.emit('typing', username);
		// socket.broadcast.emit('typing', data, username)
		socket.to(room).emit('typing', data, room, username)
	});

	
	
	socket.on('chat message', function(msg){
		// console.log('message: ' + msg);
		// console.log(GetCookieValue());
		
		var username = GetCookieValue();
		var id = socket.id 
		console.log("seding msg from " + id + ": " + msg);
		// socket.emit('datetime', { datetime: new Date()});
		// var regex = /%40/gi;
		// var username = namebfrp.replace(regex,'@')
		io.emit('chat message', msg, username, id, {datetime: new Date()});

	});

	// socket.on('chat message', ({room, message})=>{
	// 	var username = GetCookieValue();
	// 	var id = socket.id 
	// 	socket.to(room).emit('chat message',{
			
	// 		message,
	// 		name: username,
	// 		id: id,
	// 		time: {datetime: new Date()}
	// 	});
	// });


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
	app: express(),
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