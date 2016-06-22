var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('express-session');


var routes = require('./routes/index');

var app = express();

var mongoose = require('mongoose');

require('./models/poll');
var User = require('./models/user');


require('./config/passport')(passport);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(express.session({ secret: 'keyboard cat' }))
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
  proxy: true
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', routes);
// app.get('/login/twitter', passport.authenticate('twitter'));
// app.get('/login/twitter/return',
//   passport.authenticate('twitter', { successRedirect: '/',
//                                      failureRedirect: '/login' }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000, function(){
  console.log("Server listening on port 3000");
})


module.exports = app;
