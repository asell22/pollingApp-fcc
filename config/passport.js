var passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: "http://www.example.com/auth/twitter/callback"
},
function(token, tokenSecret, profile, cb) {
  return cb(null, profile);
}));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});
