const mongoose = require('mongoose');
var AutoIncrement = require('mongoose-sequence')(mongoose);
const date = new Date();

const contactSchema = mongoose.Schema({
  id: {
    type: Number,
  },
  name: {
    type: String,
  },
  mail: {
    type: String,
  },
  message: {
    type: String,
  },
  image: [
    {
      path: {
        type: String,
      },
      size: {
        type: Number,
      },
    },
  ],
});

contactSchema.plugin(AutoIncrement, { id: 'contact_seq', inc_field: 'id' });
let ContactMail = mongoose.model('ContactMail', contactSchema);
module.export = ContactMail;
