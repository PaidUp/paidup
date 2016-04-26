'use strict'
var angular = require('angular')

module.exports = [ '$scope', 'SingUpService', '$state', 'AuthService', function ($scope, SingUpService, $state, AuthService) {
  $scope.userType = SingUpService.getType()
  $scope.facebookSingUpTemplate = '<i class="fa fa-lg fa-facebook" aria-hidden="true"></i> Sing up with Facebook'
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.loading = false
  $scope.next = function () {
    // Validation start
    var f = $scope.form
    // console.log(f)
    $scope.validatePassword(f)
    SingUpService.runFormControlsValidation(f)
    if (f.$valid) {
      console.log('VALID')
      SingUpService.setFacebookSingUp(false)
      SingUpService.setCredentials($scope.user)
      if ($scope.userType === 'personal') {
        $state.go('^.step2p')
      }
      if ($scope.userType === 'business') {
        $state.go('^.step2b')
      }
    } else {
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
      SingUpService.setFacebookSingUp(true)
      if ($scope.userType === 'personal') {
        $state.go('^.step2p')
      }
      if ($scope.userType === 'business') {
        $state.go('^.step2b')
      }
    }
    var error = function (err) {
      console.log(err)
    }
    AuthService.loginFacebook(success, error)
  }
}]
