var mongoose = require('mongoose');
var date = new Date();


const portfolioSchema = mongoose.Schema({
	email:{
		type: String,
		lowercase: true
	},
	fname:{
		type: String
	},
	lname:{
		type: String
	},
	picture:{
		path:{
			type: String
		},
		size:{
			type: Number
		}
	},
	active: {
		type: Boolean,
		default: false
	}
})