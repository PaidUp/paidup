'use strict'
var angular = require('angular')

module.exports = [ '$scope', 'SignUpService', '$state', 'UserService', 'AuthService', 'TrackerService', '$timeout', function ($scope, SignUpService, $state, UserService, AuthService, TrackerService, $timeout) {
  $scope.isBusiness = function () {
    return SignUpService.getType() === 'business'
  }

  if ($scope.isBusiness()) {
    $scope.firstNamePlaceholder = 'Legal First Name'
    $scope.lastNamePlaceholder = 'Legal Last Name'
  } else {
    $scope.firstNamePlaceholder = 'First Name'
    $scope.lastNamePlaceholder = 'Last Name'
  }

  $scope.user = {}
  var isFacebookSignUp = SignUpService.getFacebookSignUp()
  if (isFacebookSignUp) {
    var currentUser = AuthService.getCurrentUser()
    $scope.user.firstName = currentUser.firstName
    $scope.user.lastName = currentUser.lastName
    // Setting just for the tracker service below
    SignUpService.setCredentials({email: currentUser.email, password1: ''})
  }
  $scope.states = UserService.getStates()
  $scope.loading = false
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.next = function () {
    // Validation start
    var f = $scope.form
    // To fix autocomplete issues
    f.$commitViewValue()
    if (SignUpService.getType() !== 'business') {
      $scope.validateTerms(f)
    }
    SignUpService.runFormControlsValidation(f)
    if (f.$valid) {
      $scope.loading = true
      var promise
      if (isFacebookSignUp) {
        promise = SignUpService.createPersonalAccountFacebook($scope.user)
      } else {
        promise = SignUpService.createPersonalAccount($scope.user)
      }
      promise.then(function (message) {
        var type = isFacebookSignUp ? "Facebook" : "Email";
        AuthService.trackerLogin("Sign Up", type);

        if (SignUpService.getType() === 'business') {
          SignUpService.saveBusinessInfo($scope.user)
          // We will add referral code later
          SignUpService.setReferralCode('')
          $state.go('^.step3b')
        } else {
          $state.go('^.step3p')
        }
      }, function (err) {
        console.log('ERROR', err)
        $scope.error = err.message + '. Redirecting to Step 1.'
        $timeout(function () {
          $state.go('^.step1')
        }, 5000)
        $scope.loading = false
      })
    } else {
      console.log('INVALID')
    }
  }
  $scope.validateTerms = function (f) {
    if (angular.isUndefined($scope.agreeTerms) || !$scope.agreeTerms) {
      f.agreeTerms.$setValidity('terms', false)
    } else {
      f.agreeTerms.$setValidity('terms', true)
    }
  }
}]
