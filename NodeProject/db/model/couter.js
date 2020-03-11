var mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);

// status: 0 = end | 1 = IC | 2 = GB
// type: 0 = keeb | 1 = keycap | 2 = etc
var couterSchema = mongoose.Schema({
    _id:{
        type : String
    },
    name:{
        type: String
    },
    seq: {
        type : Number
    }

    
    
})

couterSchema.plugin(AutoIncrement, {id : 'caterogy_sed', inc_field: 'seq'});



let Couter = mongoose.model('Couter', couterSchema);
module.exports = Couter;