var mongoose = require('mongoose');
// var AutoIncrement = require('mongoose-sequence')(mongoose);
var date = new Date();

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var trackingSchema = mongoose.Schema({
    // seq:{
    //     type: Number
    // },
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
    list_product:[
        {
            product_id:{
                type: String,
                default: null
            },
            product_name:{
                type: String,
                default: null
            },
            product_quantity:{
                type: Number
            },
            product_price:{
                type: Number,
                default: null
            },
            product_pictire:{
                type: String,
                default: null
            }
        }
    ],
    payment:{ 
        type: String
    },
    shipping_at: 
    [
        {
            customer_name:{
                type: String
            },
            customer_city:{
                type: String
            },
            customer_phone:{
                type: String
            },
            customer_address: {
                type: String
            },
            customer_country:{
                type: String
            },
            customer_postal_code:{
                type: String
            },
        }
    ],
    status_payment:{ // 0 : Pending || 1: paid
        type: Boolean,
        default: 0,
    },
    status_shipping:{ // 0: on hold || 1: Shipping || 2: Shipped
        type: Boolean,
        default: 0,
    },
    tracking_number:{
        type: String,
        default: null
    },
    shipping_unit:{
        type: String,
        default: null
    },
    date_shipping:{
        type: Date,
        default: null
    },
    date_receipt:{
        type: Date,
        default: null
    },
    total:{
        type: Number
    }
})

// trackingSchema.plugin(AutoIncrement, {id : 'tracking_sed', inc_field: 'seq'});
let Tracking = mongoose.model('Tracking', trackingSchema);
module.exports = Tracking;