var mongoose = require('mongoose');
var date = new Date();

// status: 0 = end | 1 = IC | 2 = GB
// tyle: 0 = keeb | 1 = keycap | 2 = etc
var categorySchema = mongoose.Schema({
    category_id:{
        type: String,
        uppercase: true,
    },
    category_name:{
        type: String
    },
    status_gb:{
        type: Number,
        default: 1
    },
    color: [],
    type:{
        type: Number,
    },
    profile:{
        type: String
    },
    layout:{
        type: String
    },
    date_start:{
        type: Date
    },
    date_end:{
        type: Date
    },
    date_payment:{
        type: Date
    },
    min_price:{
        type: Number
    },
    max_price:{
        type: Number
    },
    pic_profile:
    {
        path: {
            type: String
        },
        size: {
            type: Number
        },
        
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
let Category = mongoose.model('Category', categorySchema);
module.exports = Category;