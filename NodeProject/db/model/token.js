var mongoose = require('mongoose');
var date = new Date();


var tokenSchema = mongoose.Schema({
    email: String,
    token: String,
    refreshToken: String
 });
let userToken = mongoose.model('userToken', tokenSchema);
module.exports = userToken;
