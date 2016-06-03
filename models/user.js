var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;

var userConnection = mongoose.createConnection('mongodb://localhost/users');

var userSchema = new Schema({
  twitterId: String,
  username: String,
  screenName: String
});

userSchema.statics.findOrCreate = function(queryObj, profile, done) {
  // console.log("#############", profile);
  return this.findOne(queryObj, function(err, user) {
    console.log('************', profile);
    if (err) {
      return done(err);
    }

    if (!user) {
      var newUser = new User({
        twitterId: profile.id_str,
        name: profile.name,
        screenName: profile.screen_name,
      });
      newUser.save(function(err) {
        if (err) console.log(err);
        return done(err, user)
      });
    } else {
      return done(err, user)
    }
  });
}

userSchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    _id: this._id,
    username: this.displayName,
    exp: parseInt(exp.getTime() / 1000)
  }, 'SECRET');
};

var User = userConnection.model('User', userSchema);

module.exports = User;
