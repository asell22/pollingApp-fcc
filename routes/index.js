var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Poll = require('../models/poll');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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
