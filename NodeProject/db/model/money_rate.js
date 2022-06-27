var mongoose = require('mongoose');
var date = new Date();

var moneyRateSchema = mongoose.Schema({
  usd: {
    type: String,
  },
  vnd: {
    type: String,
  },
  eur: {
    type: String,
  },
  gbp: {
    type: String,
  },
  updated_at: {
    type: Date,
    default: new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    ),
  },
});
let money_rate = mongoose.model('money_rate', moneyRateSchema);
module.exports = money_rate;
