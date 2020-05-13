var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);
var date = new Date();

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var trackingSchema = mongoose.Schema({
    seq:{
        type: Number
    },
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
                type: String
            },
            product_name:{
                type: String
            },
            product_quantity:{
                type: Number
            },
            product_price:{
                type: Number
            }
        }
    ],
    payment:{ 
        type: String
    },
    shipping_at: 
    [
        {
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
        default: false
    },
    customer_name:{
        type: String
    },
    status_shipping:{ // 0: on hold || 1: Shipping || 2: Shipped
        type: Boolean,
        default: false
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
        type: Date
    },
    date_receipt:{
        type: Date
    },
    total:{
        type: Number
    }
})

trackingSchema.plugin(AutoIncrement, {id : 'tracking_sed', inc_field: 'seq'});
let Tracking = mongoose.model('Tracking', trackingSchema);
module.exports = Tracking;