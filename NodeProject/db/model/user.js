var mongoose = require('mongoose');
var date = new Date();


var userSchema = mongoose.Schema({
     name: {
            firstName: String,
            lastName: String
    },
     email: String,
     profilePicture: Buffer,
     created: { 
        type: Date,
        default: (new Date()).toJSON().slice(0, 19).replace(/[-T]/g, ':')
     }
 });
let User = mongoose.model('User', userSchema);
module.exports = User;
