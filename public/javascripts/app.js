angular.module('voting', ['ui.router', 'highcharts-ng'])
.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'partials/main.html',
        controller: 'mainCtrl',
        controllerAs: 'main',
        resolve: {
          pollPromise: ['polls', function(polls) {
            return polls.getPolls();
          }]
        }
      })
      .state('user', {
        url: '/polls/user/{user}',
        templateUrl: 'partials/main.html',
        controller: 'mainCtrl',
        controllerAs: 'main',
        resolve: {
          pollPromise: ['$stateParams', 'polls', function($stateParams, polls) {
            return polls.getUserPolls($stateParams.user);
          }]
        }
      })
      .state('form', {
        url: '/new',
        templateUrl: 'partials/form.html',
        controller: 'votingFormCtrl',
        controllerAs: 'form'
      })
      .state('poll', {
        url: '/polls/{id}',
        templateUrl: 'partials/poll.html',
        controller: 'pollCtrl',
        resolve: {
          poll: ['$stateParams', 'polls', function($stateParams, polls) {
            return polls.getPoll($stateParams.id);
          }]
        }
      })
      $urlRouterProvider.otherwise('/');
  }
])
.factory('polls', function($http) {
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
      return res.data;
    })
  };
  pollsObject.vote = function(id, index) {
    return $http.put('/polls/' + id + '/' + index).success(function(data) {
      return data;
    })
  }

  return pollsObject;
})
.controller('mainCtrl', function($scope, polls) {
  var self = this;
  self.title = "Awesome Voting App";
  self.polls = polls.polls;
})
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
          {title: self.name, user: self.username, options: self.options}
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
.controller('pollCtrl', function($scope, polls, poll) {

  $scope.poll = poll;
  var title = $scope.poll.title;
  var data = $scope.poll.options;
  $scope.pieData = [];
  angular.forEach(data, function(val) {
    $scope.pieData.push([
      val.name, val.totalVotes
    ])
  })


  $scope.chartConfig = {
    options: {
      chart: {
        type: 'pie'
      }
    },
    series: [{
      type: 'pie',
      data: $scope.pieData
    }],
    title: {
      text: title
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %'
        },
        showInLegend: true
      }
    },
    loading: false
  }

  $scope.increment = function(option) {
    console.log($scope.poll);
    var data = $scope.chartConfig.series[0].data;
    var index = this.$index;
    data[index][1]++;
    option.totalVotes++;
    polls.vote(poll._id, index);
  }
})
