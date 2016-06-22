angular.module('voting')
.controller('votingFormCtrl', function($scope, polls, $state) {
  var self = this;
  self.polls = polls;
  self.count = self.polls.length;
  self.options = [];
  self.optionCount = 1;

  self.addOption = function() {
    self.optionObj = {
      name: self.option,
      count: self.optionCount,
      totalVotes: 0
    }
    if (self.option) {
      self.options.push(self.optionObj);
      self.option = '';
      self.optionCount++;
    }
  }

  self.addPoll = function() {
    if (self.options.length > 1) {
      angular.forEach($scope.pollForm.$error.required, function(field) {
        field.$setTouched();
      });

      if ($scope.pollForm.$valid) {
        polls.create(
          {
            title: self.name,
            user: self.username,
            options: self.options
          }
        )
        $scope.pollForm.$setUntouched();
        this.name = '';
        this.username = '';
        $state.go('home');
      }
    } else {
      angular.element(document).find("h5").addClass('highlight');
    }
  }
})
