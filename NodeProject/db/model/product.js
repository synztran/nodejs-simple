var mongoose = require('mongoose');
var date = new Date();

// product_accessory: 0 = Keeb Top Case | 1 = Keeb Bot case | 2 = Keeb Plate | 4 = keycap

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
    product_accessory:{
        type: Number,
        default: null
    },
    outstock:{
        type: Boolean,
        default: false
    },
    c_code_color:[],
    c_kit_name:{
        type: String,   
    },
    k_top_color:{
        type: String
    },
    k_material:{
        type: String
    },
    k_bot_color:{
        type: String
    },
    k_plate_option:{
        type: String
    },
    k_material:{
        type: String
    },
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
    note:{
        type: String
    }
})
let Product = mongoose.model('Product', productSchema);
module.exports = Product;