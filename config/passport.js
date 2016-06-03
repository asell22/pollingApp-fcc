var passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    User = require('../models/user');


module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(obj, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
}

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_CONSUMER_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
  callbackURL: "http://127.0.0.1:3000/auth/twitter/callback",
  passReqToCallback: true
},
  function(req, token, tokenSecret, profile, cb) {
    User.findOrCreate({ twitterId: profile.id }, profile, function (err, user) {
      return cb(err, user);
    });
  }
));
