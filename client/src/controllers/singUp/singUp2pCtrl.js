'use strict'
var angular = require('angular')

module.exports = [ '$scope', 'SingUpService', '$state', 'UserService', function ($scope, SingUpService, $state, UserService) {
  var user = SingUpService.getUser()
  console.log(user)
  $scope.states = UserService.getStates()
  $scope.next = function () {
    // Validation start
    var f = $scope.form
    $scope.validateTerms(f)
    SingUpService.runFormControlsValidation(f)
    if (f.$valid) {
      console.log('VALID')
      console.log(SingUpService.createPersonalAccount($scope.user))
      // $state.go('^.step3p')
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
