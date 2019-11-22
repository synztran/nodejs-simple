var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
    img: 
    { 
    	data: Buffer, 
    	contentType: String 
    }
})

let Image = mongoose.model('Image', imageSchema)
module.exports = Image;