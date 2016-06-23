angular.module('voting')
.controller('mainCtrl', function($scope, polls, $http) {
  var self = this;
  self.title = "Voting App";
  self.polls = polls.polls;
  $scope.deletePoll = function(id, index) {
    $http.delete('/polls/' + id).then(function(res){
      console.log(res)
      self.polls.splice(index, 1);
      console.log("Deleted!");
    })
  }
  $scope.removeNavActiveClass = function() {
    $('.nav li').removeClass('active');
  }
})
