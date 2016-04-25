'use strict'

module.exports = [ '$scope', 'SingUpService', '$state', 'UserService', function ($scope, SingUpService, $state, UserService) {
  $scope.payFee = function () {
    // Validation start
    var f = $scope.form
    SingUpService.runFormControlsValidation(f)
    if (f.$valid) {
      console.log('VALID - PROCESS PAYMENT')
      $state.go('^.welcome')
    } else {
      console.log('INVALID')
    }
  }
}]
