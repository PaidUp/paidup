'use strict'
var angular = require('angular')

module.exports = [ '$scope', 'SingUpService', '$state', function ($scope, SingUpService, $state) {
  $scope.userType = SingUpService.getType()
  $scope.next = function () {
    // Validation start
    var f = $scope.form
    // console.log(f)
    $scope.validatePassword(f)
    SingUpService.runFormControlsValidation(f)
    if (f.$valid) {
      console.log('VALID')
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
}]
