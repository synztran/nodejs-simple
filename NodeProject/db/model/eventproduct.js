var mongoose = require('mongoose');
var date = new Date();

var eventproductSchema = mongoose.Schema({
	event_product_name:{
		type: String
	},
	event_product_image:{
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
	date_create:{
		type: Date,
	},
	date_start:{
		type: String,
	},
	date_end:{
		type: String
	},
	event_product_url_1:{
		type: String
	},
	event_product_url_2:{
		type: String
	}

})

let EventProduct = mongoose.model('EventProduct', eventproductSchema);
module.exports = EventProduct