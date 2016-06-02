'use strict'
var angular = require('angular')

module.exports = [ '$scope', 'SignUpService', '$state', '$timeout', function ($scope, SignUpService, $state, $timeout) {
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

  var timeoutPromise = $timeout(function () {
    $state.go('dashboard.summary.components')
  }, 5000)

  $scope.goToHomepage = function () {
    $timeout.cancel(timeoutPromise)
    $state.go('dashboard.summary.components')
  }

  $scope.$on('destroy', function () {
    $timeout.cancel(timeoutPromise)
  })
}]
