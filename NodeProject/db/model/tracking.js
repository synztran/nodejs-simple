var mongoose = require('mongoose');
var date = new Date();

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var trackingSchema = mongoose.Schema({
    order_id:{
        type: String
    },
    email:{
        type: String,
        lowercase: true,
        required: 'Email address is required',
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    category_id:{
        type: String,
        uppercase: true,
    },
    category_name:{
        type: String
    },
    list_product:[
        {
            product_id:{
                type: String
            },
            product_name:{
                type: String
            },
        }
    ],
    payments:{ 
        type: Number
    },
    status_payment:{ // 0 : Pending || 1: paid
        type: Boolean,
        default: false
    },
    status_shipping:{ // 0: on hold || 1: Shipping || 2: Shipped
        type: Boolean,
        default: false
    },
    tracking_number: {
        type: String,
        default: null
    },
    shipping_unit:{
        type: String
    },
    address:{
        type: String
    },
    zipcode:{
        type: String
    },
    date_shipping:{
        type: Date
    },
    date_receipt:{
        type: Date
    },
    date_paid:{
        type: Date
    },
    total:{
        type: Number
    }
})
let Tracking = mongoose.model('Tracking', trackingSchema);
module.exports = Tracking;