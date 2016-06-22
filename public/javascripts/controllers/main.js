angular.module('voting')
.controller('mainCtrl', function($scope, polls, $http) {
  var self = this;
  self.title = "Awesome Voting App";
  self.polls = polls.polls;
  $scope.deletePoll = function(id, index) {
    $http.delete('/polls/' + id).then(function(res){
      console.log(res)
      self.polls.splice(index, 1);
      console.log("Deleted!");
    })
  }
})
