var mongoose = require('mongoose');
var date = new Date();

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var admaccountSchema = mongoose.Schema({
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
    password: {
        type: String,
        // required: true
    },
    fname:{
        type: String,
        max: 60
    },
    lname:{
        type: String,
        max: 60
    },
    created: {
        type: Date,
        default: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()))
    },
    picture:{
    	// data: Buffer,
        path: {
            type: String
        },
        size: {
            type: Number
        },
        
        // required: true
        
    },
    active:{
        type: Boolean,
        default: false
    }
})
let AdmAccount = mongoose.model('AdmAccount', admaccountSchema);
module.exports = AdmAccount;