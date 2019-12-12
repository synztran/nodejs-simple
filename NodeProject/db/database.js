let mongoose = require('mongoose');
// const Grid = require('gridfs-stream');
// const GridFsStorage = require('multer-gridfs-storage');
// let gfs;

class Database{
	constructor(){
		this._connect()
	}
	_connect(){
		mongoose.connect('mongodb+srv://admin:root@cluster0-u7ysm.mongodb.net/test?retryWrites=true&w=majority', {dbName: 'testmongodb'}).then(() =>{
			console.log("connect success!");
		}).catch(err =>{
			console.log("error");
		})
	}
}
module.exports = new Database();