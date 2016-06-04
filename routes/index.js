var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Poll = require('../models/poll');
var passport = require('passport');
require('../config/passport')(passport);


/* GET home page. */
router.get('/', function(req, res, next) {
  if (req.user) {
    console.log('$$$$$$$$$$$$$$', req.user.username);
  }
  res.render('index', { user: 'hello' });
});

router.get('/error', function(req, res) {
  res.send('Something went wrong')
})

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  failureRedirect:'/error',
  successRedirect: '/'
}));

router.get('/yes', function(req, res) {
  res.send('YES')
})

router.get('/polls', function(req, res, next) {
  Poll.find(function(err, polls) {
    if (err) {
      return next(err);
    }
    res.json(polls);
  })
});

router.post('/polls', function(req, res, next) {
  var poll = new Poll(req.body);

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
  res.json(req.poll);
});

router.put('/polls/:poll/:index', function(req, res, next) {
  var index = req.params.index;
  Poll.findById(req.poll, function(err, poll) {
    if (err) res.send(err)
    poll.options[index].totalVotes++;
    poll.save(function(err) {
      if (err) res.send(err);
      res.send(poll);
    })
  })
});

module.exports = router;
