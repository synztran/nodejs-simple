var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/testmongodb');

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
module.exports = User;