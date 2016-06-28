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
  res.render('index', { user: user});
});

router.get('/error', function(req, res) {
  res.send('Something went wrong')
})

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
  failureRedirect:'/error',
  successRedirect: '/'
}));

router.get('/logout', isAuthenticated, function(req, res) {
  console.log('logout clicked');
  req.logout();
  res.redirect('/')
});

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
  poll.user = req.user.username
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
  var ipAddr = req.headers["x-forwarded-for"];
  if (ipAddr){
    var list = ipAddr.split(",");
    ipAddr = list[list.length-1];
  } else {
    ipAddr = req.connection.remoteAddress;
  }

  if (req.user) {
    var user = req.user;
  } else {
    var user = {twitterId: 'null', username: ipAddr, displayName: 'null'};
  }
  res.json({poll: req.poll, user: user, ip: ipAddr});
});

router.delete('/polls/:poll', function(req, res) {
  Poll.findByIdAndRemove(req.poll, function(err, poll) {
    if (err) res.send(err);
    // res.send(polls);
    res.send(poll);
  })
});

router.put('/addoption/polls/:poll/:option', function(req, res, next) {
  var optionName = req.params.option;
  console.log(optionName);
  Poll.findById(req.poll, function(err, poll) {
    var option = {
      name: optionName,
      count: poll.options.length++,
      totalVotes: 1
    }
    if (err) res.send(err);
    poll.options.push(option);
    poll.users.push(req.user.username);
    poll.save(function(err) {
      if(err) res.send(err);
      res.send({poll: poll})
    })
  })
})

router.put('/polls/:poll/:index', function(req, res, next) {
  console.log('***************',req.ip)
  var index = req.params.index;
  var ip = String(req.ip);

  if (req.user) {
    var authUser = req.user.username;
    var userObj = req.user;
  } else {
    var authUser = String(req.ip);
    var userObj = {twitterId: 'null', username: String(req.ip), displayName: 'null'}
  }

  Poll.findById(req.poll, function(err, poll) {
    // var username = authUser.username
    if (err) res.send(err)
    // poll.users.push(username);
    poll.options[index].totalVotes++;
    poll.users.push(authUser);
    poll.save(function(err) {
      if (err) res.send(err);
      res.send({poll: poll, user: userObj, ip: ip});
    })
  })
});

router.get('*', function(req, res, next) {
  if (req.user) {
    var user = req.user.username;
  }
  res.render('index', { user: user });
})

function isAuthenticated(req, res, next) {
  if (req.user) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
