var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var crypto = require('crypto');

var userSchema = new Schema({
  username: {
    type: String,
    lowercase: true,
    unique: true
  },
  hash: String,
  salt: String
})

userSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');

  this.hash = crypto.pbkdf2Sync(password, this.salt, 100000, 64).toString('hex');
};

userSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 100000, 64).toString('hex');

  return this.hash === hash;
}

var User = mongoose.model('User', userSchema);
module.exports = User;
