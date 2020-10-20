var mongoose = require('mongoose');
var date = new Date();

var mainpage_contentSchema = mongoose.Schema({
	content_type:{
		type: Number, // 1 = Explain & Consultation | 2 = Assembled | 3 = Lube Service | 4 = Support
		default: 0
	},
	specs:{
		type: String
	},
	status:{
		type: Number, // 0 = Non active | 1 = Active
		default: 1
	},
	date_add:{
		type: Date,
	}
})

let mainpage_content = mongoose.model('mainpage_content', mainpage_contentSchema);
module.exports = mainpage_content