var mongoose = require('mongoose');
var tokenSchema = mongoose.Schema({
  token_discord: String,
});
let botToken = mongoose.model('botToken', tokenSchema);
module.exports = botToken;
