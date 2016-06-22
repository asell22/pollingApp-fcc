angular.module('voting')
.controller('navCtrl', function() {
  var self = this;
  self.makeActive = function($event) {
    $('.nav li').removeClass('active');
    $($event.currentTarget).addClass('active');
  }

  self.logoClick = function($event) {
    $('.nav li').removeClass('active');
    var home = $('#navbar > .nav').children()[0];
    $(home).addClass('active');
  }
})
