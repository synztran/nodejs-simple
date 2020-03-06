var mongoose = require('mongoose');
var date = new Date();



var productSchema = mongoose.Schema({
    product_id:{
        type: String,
        uppercase: true
    },
    product_name:{
        type: String
    },
    category_id:{
        type: String
    },
    outstock:{
        type: Boolean,
        default: false
    },
    color: [],
    price:{
        type: Number
    },
    pic_list: [
        {
            path: {
                type: String
            },
            size: {
                type: Number
            },
            
        }
    ],
})
let Product = mongoose.model('Product', productSchema);
module.exports = Product;