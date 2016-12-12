'use strict'
var angular = require('angular')

module.exports = ['$scope', 'SignUpService', '$state', '$timeout', '$rootScope', 'AuthService', 'UserService', function ($scope, SignUpService, $state, $timeout, $rootScope, AuthService, UserService) {
  $scope.userType = SignUpService.getType()

  if ($scope.userType === 'personal') {
    $scope.welcomeTitle = 'Welcome to PaidUp.'
    $scope.welcomeMsg = 'You will be redirected to your account page in a few seconds or click the link below.'
  }
  if ($scope.userType === 'business') {
    $scope.welcomeTitle = 'Welcome to PaidUp. We are excited to join your team.'
    if (angular.isDefined(SignUpService.getReferralCode())) {
      $scope.welcomeMsg = 'Thanks for submitting your referral code. You must know some important people. You will be redirected to your account page in a few seconds or click the link below.'
    } else {
      $scope.welcomeMsg = 'Your payment was processed successfully. You will be redirected to your account page in a few seconds or click the link below.'
    }
  }

  AuthService.getCurrentUserPromise().then(function (user) {
    console.log(user);
    var zendeskUserParams = {
      username: 'ricardo@getpaidup.com', 
      token : 'ALTnkNkK72Cu28uBK30p7e20FUYEDOVytF6Y5GtI', 
      subdomain: 'getpaidup1478060212',
      fullName: user.firstName + ' ' + user.lastName, 
      email: user.email
    };
    if(user.contacts.length){
      zendeskUserParams.phone = user.contacts[0].value;
    }

    UserService.createZendeskUser(zendeskUserParams).then(function (res) {
      console.log(res);
    }).catch(function(err){
      console.log(err);
    });
  })

  var timeoutPromise = $timeout(function () {
    $state.go(getRedirectPageLogin($scope.userType))
  }, 5000)

  $scope.goToHomepage = function () {
    $timeout.cancel(timeoutPromise)
    $state.go(getRedirectPageLogin($scope.userType))
  }

  $scope.$on('destroy', function () {
    $timeout.cancel(timeoutPromise)
  })

  function getRedirectPageLogin(userType) {
    if (userType === 'business') {
      return 'dashboard.board'
    } else {
      return 'dashboard.summary.components'
    }
  }
}]
