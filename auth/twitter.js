var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var User = require('../models/user');
var init = require('./init');

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: 'http://127.0.0.1:3000/auth/twitter/callback'
},
function(accessToken, refreshToken, profile, done) {
  var searchQuery = {
    name: profile.displayName
  };

  var updates = {
    name: profile.displayName,
    id: profile.id
  };

  var options = {
    upsert: true
  };

  User.findOneAndUpdate(searchQuery, updates, options, function(err, user) {
    if (err) {
      return done(err);
    } else {
      return done(null, user);
    }
  })
}
));

init();

module.exports = passport;
