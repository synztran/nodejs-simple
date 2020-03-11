var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);
var date = new Date();



var categorySchema = mongoose.Schema({
    count:{
        type: Number
    },
    category_id:{
        type: String,
        uppercase: true,
        require: true,
    },
    category_name:{
        type: String
    },
    status_gb:{ // status: 0 = end | 1 = IC | 2 = GB
        type: Number,
        default: 1
    },
    k_color: [],
    
    c_code_color:[], // type: 0 = keeb | 1 = keycap | 2 = etc
    type:{
        type: Number,
    },
    c_profile:{
        type: String
    },
    c_material:{
        type: String
    },
    k_layout:[]
    // {
    //     type: String,
    //     default: null
    // }
    ,
    k_degree:{
        type: String,
        default: null
    },
    k_mounting:{
        type: String,
        default: null
    }, 
    sale_type:[],
    date_start:{
        type: Date,
        default: null,
    },
    date_end:{
        type: Date,
        default: null
    },
    date_payment:{
        type: Date,
        default: null
    },
    min_price:{
        type: Number,
        default: null
    },
    max_price:{
        type: Number,
        default: null
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

categorySchema.plugin(AutoIncrement, {id : 'category_seq', inc_field: 'count'});



let Category = mongoose.model('Category', categorySchema);
module.exports = Category;