var mongoose = require('mongoose');
var date = new Date();

var adsproductSchema = mongoose.Schema({
	product_name:{
		type: String
	},
	author_name:{
		type: String
	},
	specs:{
		type: String
	},
	pic_product:{
		path:{
			type: String
		},
		size:{
			type: Number
		}
	},
	status:{
		type: Number,
		default: 0
	},
	date_add:{
		type: Date,
	}
})

let AdsProduct = mongoose.model('AdsProduct', adsproductSchema);
module.exports = AdsProduct