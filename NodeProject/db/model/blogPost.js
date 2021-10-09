var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);
var data = new Date();

var blogPostSchema = mongoose.Schema({
	id:{
		type: Number
	},
	blogCategory_id:{
		type: String
	},
	blogCategory_name:{
		type: String,
		lowercase: true
	},
	blogPost_id:{
		type: String,
		require: true
	},
	blogPost_name:{
		type: String,
		lowercase: true
	},
	author:{
		type: String,
	},
	comments:[],
	reacts:[],
	created_at: {
		type: Date,
		default: null
	},
	content:{
		type: String,
		default:  null
	}
})

blogPostSchema.plugin(AutoIncrement, {id: 'blogPost_seq', inc_field: 'id'})

let BlogPost = mongoose.model('BlogPost', blogPostSchema);
module.export = BlogPost