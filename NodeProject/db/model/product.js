var mongoose = require('mongoose');
var date = new Date();



var productSchema = mongoose.Schema({
    product_id:{
        type: String
    },
    product_name:{
        type: String
    },
    category:{
        type: String
    },
    status_gb:{
        type: Boolean,
        default: false
    },
    color: [],
    date_start:{
        type: Date
    },
    date_end:{
        type: Date
    },
    price:{
        type: Number
    }
})
let Product = mongoose.model('Product', productSchema);
module.exports = Product;