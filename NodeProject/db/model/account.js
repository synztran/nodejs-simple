var mongoose = require('mongoose');
var date = new Date();

var validateEmail = function (email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

var addressSchema = mongoose.Schema({
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  zip_code: {
    type: String,
  },
});

var accountSchema = mongoose.Schema({
  email: {
    // required: true,
    type: String,
    lowercase: true,
    required: 'Email address is required',
    validate: [validateEmail, 'Please fill a valid email address'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address',
    ],
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
  fname: {
    type: String,
  },
  lname: {
    type: String,
  },
  birth_date: {
    type: Date,
  },
  shipping_at:
    // [addressSchema],
    [
      {
        fname: {
          default: null,
          type: String,
        },
        lname: {
          default: null,
          type: String,
        },
        cname: {
          default: null,
          type: String,
        },
        email: {
          default: null,
          type: String,
          lowercase: true,
        },
        town_city: {
          default: null,
          type: String,
        },
        phone_number: {
          default: null,
          type: String,
        },
        address: {
          type: String,
        },
        country: {
          type: String,
        },
        zip_code: {
          type: String,
        },
      },
    ],
  // {
  //     address:{
  //         type: String
  //     },
  //     city:{
  //         type: String

  //     },
  //     zip_code:{
  //         type: String
  //     },

  // },
  phone_area_code: {
    type: String,
    default: null,
  },
  phone_number: {
    default: null,
    type: String,
  },
  created: {
    type: Date,
    default: new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    ),
  },
  active: {
    type: Boolean,
    default: false,
  },
  actived_date: {
    type: Date,
    default: null,
  },
  get_noti: {
    type: Boolean,
    default: false,
  },
  paypal: {
    type: String,
    default: null,
    lowercase: true,
    // required: 'Email address is required',
    // validate: [validateEmail, 'Please fill a valid email address'],
    // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
  },
  fb_url: {
    type: String,
    default: null,
    lowercase: true,
  },
  registration_token: {
    type: String,
    default: null,
  },
  expiration_token_date: {
    type: String,
    default: null,
  },
});
let Account = mongoose.model('Account', accountSchema);
module.exports = Account;
