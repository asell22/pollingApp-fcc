angular.module('voting')
.factory('polls', function($http, $window) {
  var pollsObject = {};
  pollsObject.polls = [];
  pollsObject.getPolls = function() {
    return $http.get('/polls').success(function(data) {
      angular.copy(data, pollsObject.polls)
    })
  };
  pollsObject.getUserPolls = function(user) {
    return $http.get('/polls/user/' + user).success(function(data) {
      angular.copy(data, pollsObject.polls)
    })
  }
  pollsObject.create = function(poll) {
    return $http.post('/polls', poll).success(function(data) {
      pollsObject.polls.push(data);
    })
  };
  pollsObject.getPoll = function(id) {
    return $http.get('/polls/' + id).then(function(res) {
      return {poll: res.data.poll, user: res.data.user, ip: res.data.ip};
    })
  };
  pollsObject.vote = function(id, index) {
    return $http.put('/polls/' + id + '/' + index).then(function(data) {
      // console.log('poll:', data.poll.users);
      // console.log('authenticated user:', data.user.username);
      // data.poll.users.push(data.user.username);
      return data;
    })
  }
  pollsObject.addAnotherOption = function(id, option) {
    return $http.put('/addoption/polls/' + id + '/' + option).then(function(data) {
      $window.location.reload();
      return data;
    })
  }
  return pollsObject;
})
