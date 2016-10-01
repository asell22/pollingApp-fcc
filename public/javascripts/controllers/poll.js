angular.module('voting')
.controller('pollCtrl', function($scope, polls, poll) {
  $scope.ip = poll.ip
  $scope.poll = poll.poll;
  $scope.user = poll.user;
  $scope.isAuthenticated = true;
  $scope.hasVoted;
  if ($scope.poll.users.indexOf($scope.user.username) !== -1) {
    $scope.hasVoted = true;
  } else {
    $scope.hasVoted = false;
  }
  $scope.another = '';


  if ($scope.user.username === $scope.ip) {
    $scope.isAuthenticated = false;
  }

  console.log("Here's the IP address after the page loads", $scope.ip);
  console.log("Here's the username (will be IP address if user is unauthenticated)", $scope.user.username);
  // console.log("Is this user authenticated?:", $scope.isAuthenticated);
  // console.log("Has the user voted?:", $scope.hasVoted);
  console.log("$scope.poll:", $scope.poll);

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
    console.log("Here's the IP address after the user votes", $scope.ip);
    console.log("This should be stored in $scope.poll.users array. Refresh the page and see what was actually stored in $scope.poll.users");
    $scope.hasVoted = true;
    if ($scope.poll.users.indexOf($scope.user.username) !== -1) {
      alert("You already voted on this poll!");
    } else {
      $scope.poll.users.push($scope.user.username);
      var data = $scope.chartConfig.series[0].data;
      var index = this.$index;
      data[index][1]++;
      option.totalVotes++;
      polls.vote($scope.poll._id, index);
    }
  }

  $scope.addAnotherOption = function(option) {
    var upperCaseOption = option.toUpperCase();
    var optionNames = [];
    $scope.poll.options.forEach(function(opt) {
      optionNames.push(opt.name.toUpperCase());
    })
    console.log("optionNames:", optionNames);
    if (optionNames.indexOf(upperCaseOption) !== -1) {
      alert("This is already a voting option!");
      $scope.another = '';
    } else {
      console.log(option);
      polls.addAnotherOption($scope.poll._id, option);
    }
  }
})
