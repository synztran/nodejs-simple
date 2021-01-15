var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);
var date = new Date();

var invoiceSchema = mongoose.Schema({
    invoice_count:{
        type: Number
    },
    invoice_id:{
        type: String,
        uppercase: true,
        require: true,
    },
    // user_id:{
    //     type: String,
    //     require: true
    // },
    user_name:{
        type: String,
        default: "customer"
    }
    status_payment:{ // status: 0 = Unpay | 1 = Paid
        type: Number,
        default: 0
    },
    invoice_type:{ // type: 0 = GB | 1 = Assembled Service | 2 = Lube Service | 3 = Other
        type: Number,
    },
    created_date:{
        type: Date,
        default: new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()))
    },
    invoice_details: [
        {
            path: {
                type: String
            },
            total: {
                type: Number
            },
            note:{
                type: String
            }
            
        }
    ],
    note:{
        type: String
    }
    
})

invoiceSchema.plugin(AutoIncrement, {id : 'invoice_seq', inc_field: 'invoice_count'});



let Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;