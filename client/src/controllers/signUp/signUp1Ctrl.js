'use strict'
var angular = require('angular')

module.exports = [ '$scope', 'SignUpService', '$state', 'AuthService', function ($scope, SignUpService, $state, AuthService) {
  $scope.userType = SignUpService.getType()
  $scope.facebookSignUpTemplate = '<i class="fa fa-lg fa-facebook" aria-hidden="true"></i> Sign up with Facebook'
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.loading = false
  $scope.next = function () {
    // Validation start
    $scope.loading = true
    var f = $scope.form
    // To fix autocomplete issues
    f.$commitViewValue()
    $scope.validatePassword(f)
    SignUpService.runFormControlsValidation(f)
    if (f.$valid) {
      console.log('VALID')
      SignUpService.setFacebookSignUp(false)
      SignUpService.setCredentials($scope.user)
      $scope.loading = false
      $state.go('^.step2')
    } else {
      $scope.loading = false
      console.log('INVALID')
    }
  }

  $scope.validatePassword = function (f) {
    if (!angular.equals(f.uPass1.$viewValue, f.uPass2.$viewValue) || (f.uPass1.$viewValue === undefined && f.uPass2.$viewValue === undefined)) {
      f.uPass2.$setValidity('match', false)
    } else {
      f.uPass2.$setValidity('match', true)
    }
  }

  $scope.facebookSignUp = function () {
    $scope.loading = true
    var success = function (user) {
      SignUpService.setFacebookSignUp(true)
      $state.go('^.step2')
    }
    var error = function (err) {
      console.log(err)
    }
    AuthService.loginFacebook(success, error)
  }
}]
