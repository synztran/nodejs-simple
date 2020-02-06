var mongoose = require('mongoose');
var date = new Date();

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

var trackingSchema = mongoose.Schema({
    id:{
        type: String
    },
    product_id:{
        type: String
    },
    product_name:{
        type: String
    },
    status_shipping:{
        type: Boolean,
        default: false
    },
    status_paid:{
        type: Boolean,
        default: false
    },
    tracking_number: {
        type: String,
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