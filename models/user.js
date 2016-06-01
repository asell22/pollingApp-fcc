var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var User = new Schema({
  name: String,
  id: String
});

module.exports = mongoose.model('user', User);
