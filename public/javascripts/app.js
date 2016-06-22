angular.module('voting', ['ui.router', 'highcharts-ng'])
.config(['$locationProvider', function($locationProvider) {
  $locationProvider.html5Mode({enabled: true, requireBase: false});
}])
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
        templateUrl: 'partials/user.html',
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
        url: '/poll/{id}',
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
