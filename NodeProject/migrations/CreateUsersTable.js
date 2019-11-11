var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
     name: {
            firstName: String,
        	lastName: String
    },
     email: String,
     profilePicture: Buffer,
     created: { 
        type: Date,
        default: Date.now
     }
 });
const User = mongoose.model('User', userSchema);
