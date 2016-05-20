var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true
  },
  hash: String,
  salt: String
})

var User = mongoose.model('User', userSchema);
module.exports = User;
