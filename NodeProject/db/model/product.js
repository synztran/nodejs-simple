var mongoose = require('mongoose');
var date = new Date();

// product_accessory: 0 = Keeb Top Case | 1 = Keeb Bot case | 2 = Keeb Plate | 3 = Keeb Frame | 4 = keycap

var productSchema = mongoose.Schema({
    product_id:{
        type: String,
        uppercase: true
    },
    product_name:{
        type: String
    },
    replace_product_name:{
        type: String
    },
    category_id:{ 
        type: String
    },
    category_url_name:{
        type: String
    },
    product_part:{
        // product_accessory: 0 = Keeb Top Case | 1 = Keeb Bot case | 2 = Keeb Plate | 3 = Keeb Frame | 4 = keycap | 5 = switches | 7 = artisan | 8 = etc
        type: Number,
        default: null
    },
    outstock:{  // 0 = outstock | 1 = instock
        type: Number,
    },
    c_code_color:[],
    c_profile:{
        type: String
    },
    c_material:{ // 0 = abs | 1 = pbt | 2 = pom | 3 = etc
        type: Number
    },
    k_top_color:{
        type: String
    },
    k_top_material:{
        type: String
    },
    k_bot_color:{
        type: String
    },
    k_bot_material:{
        type: String
    },
    k_plate_option:{
        type: String
    },
    k_plate_material:{
        type: String
    },
    price:{
        type: Number
    },
    pic_product:{
        path: {
            type: String
        },
        size: {
            type: Number
        }
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
    specs:{
        type: String
    }
})


let Product = mongoose.model('Product', productSchema);
module.exports = Product;