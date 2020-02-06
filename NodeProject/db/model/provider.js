var mongoose = require('mongoose');
var date = new Date();

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var providerSchema = mongoose.Schema({
    email: {
        // required: true,
        type: String,
        lowercase: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        // validate: {
        // 	validator: function(email){
        // 		var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
        // 		return emailRegex.test(email.text);
        // 	},
        // 	message: 'Email handle must have @'
        // }
    },
    password:{
        type: String
    },
    fname:{
        type: String
    },
    lname:{
        type: String
    },
    nationnal:{
        type: String
    },
    phone_area_code:{
        type: String
    },
    phone_number:{
        type: String
    },
    date_join:{
        type: Date,
        default: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()))
    },
    number_hostproxy:{
        type: Number
    },
    active:{
        type: Boolean,
        default: false
    }
    
})
let Provider = mongoose.model('Provider', providerSchema);
module.exports = Provider;