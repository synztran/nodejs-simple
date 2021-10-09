var mongoose = require('mongoose')
var AutoIncrement = require('mongoose-sequence')(mongoose);
var date = new Date();

var blogCategorySchema = mongoose.Schema({
	id:{
		type: Number
	},
	blogCategory_id:{
		type: String,
		require: true
	},
	blogCategory_name:{
		type: String,
		lowercase: true
	},
	author:{
		type: String
	},
	status:{ // 0 = hide | 1 = show
		type: Number,
		default: 0
	},
	date_created: {
		type: Date,
	},
})

blogCategorySchema.plugin(AutoIncrement, {id: 'blogCategory_seq', inc_field: 'id'})

let BlogCategory = mongoose.model('BlogCategory', blogCategorySchema);
module.export = BlogCategory