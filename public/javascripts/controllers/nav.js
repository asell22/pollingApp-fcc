
angular.module('voting')
.controller('navCtrl', function($http, $window) {
  var self = this;

  self.user = false;

  self.toggleUser = function() {
    self.user = !self.user;
  }

  self.makeActive = function($event) {
    $('.nav li').removeClass('active');
    $($event.currentTarget).addClass('active');
  }

  self.logoClick = function($event) {
    $('.nav li').removeClass('active');
    var home = $('#navbar > .nav').children()[0];
    $(home).addClass('active');
  }

  self.logOut = function() {
    return $http.get('/logout').then(function(data) {
      $window.location.reload();
      return data;
    })
  }
})
