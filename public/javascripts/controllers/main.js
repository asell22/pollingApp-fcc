angular.module('voting')
.controller('mainCtrl', function($scope, polls, $http) {
  var self = this;
  self.title = "Voting App";
  self.polls = polls.polls;
  $scope.deletePoll = function(id, index) {
    $http.delete('/polls/' + id).then(function(res){
      self.polls.splice(index, 1);
    })
  }
  $scope.removeNavActiveClass = function() {
    $('.nav li').removeClass('active');
  }
})
