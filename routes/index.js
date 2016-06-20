var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Poll = require('../models/poll');
var passport = require('passport');
require('../config/passport')(passport);

/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user) {
    var user = req.user.username;
    console.log('$$$$$$$$$$$$$$', req.user);
  }
  res.render('index', { user: user });
});

router.get('/error', function(req, res) {
  res.send('Something went wrong')
})

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  failureRedirect:'/error',
  successRedirect: '/'
}));

router.get('/polls', function(req, res, next) {
  Poll.find(function(err, polls) {
    if (err) {
      return next(err);
    }
    res.json(polls);
  })
});

router.get('/polls/user/:user', function(req, res, next) {
  var user = req.params.user;
  Poll.find({user: user}, function(err, polls) {
    if (err) {
      return next(err);
    }
    res.json(polls);
  })
})

router.post('/polls', isAuthenticated, function(req, res, next) {
  var poll = new Poll(req.body);
  poll.user = req.user.username || 'not auth';
  poll.users = [];
  poll.save(function(err, poll) {
    if (err) {
      return next(err);
    }

    res.json(poll);
  })
});

router.param('poll', function(req, res, next, id) {
  var query = Poll.findById(id);

  query.exec(function(err, poll) {
    if (err) {
      return next(err);
    }

    if (!poll) {
      return next(new Error('cannot find poll'));
    }

    req.poll = poll;
    return next();
  })
});

router.get('/polls/:poll', function(req, res) {
  var user = req.user;
  res.json({poll: req.poll, user: user});
});

router.delete('/polls/:poll', function(req, res) {
  Poll.findByIdAndRemove(req.poll, function(err, poll) {
    if (err) res.send(err);
    // res.send(polls);
    res.send(poll);
  })
})

router.put('/polls/:poll/:index', function(req, res, next) {
  console.log('***************',req.ip)
  var index = req.params.index;
  var authUser = req.user.username || 'auth user';

  Poll.findById(req.poll, function(err, poll) {
    // var username = authUser.username
    if (err) res.send(err)
    // poll.users.push(username);
    poll.options[index].totalVotes++;
    poll.users.push(authUser);
    poll.save(function(err) {
      if (err) res.send(err);
      res.send({poll: poll, user: req.user});
    })
  })
});

function isAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
