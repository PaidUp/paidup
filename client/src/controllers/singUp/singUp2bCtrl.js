'use strict'

module.exports = [ '$scope', 'SingUpService', '$state', 'UserService', function ($scope, SingUpService, $state, UserService) {
  $scope.states = UserService.getStates()
  $scope.next = function () {
    // Validation start
    var f = $scope.form
    SingUpService.runFormControlsValidation(f)
    if (f.$valid) {
      console.log('VALID')
      console.log(SingUpService.saveBusinessInfo($scope.user))
      $state.go('^.step3b')
    } else {
      console.log('INVALID')
    }
  }
}]
