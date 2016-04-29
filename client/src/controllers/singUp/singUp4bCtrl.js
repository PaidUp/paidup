'use strict'
var angular = require('angular')

module.exports = [ '$scope', 'SingUpService', '$state', 'UserService', function ($scope, SingUpService, $state, UserService) {
  $scope.next = function () {
    // Validation start
    var f = $scope.form
    $scope.validateTerms(f)
    $scope.validateDDA(f)
    SingUpService.runFormControlsValidation(f)
    if (f.$valid) {
      console.log('VALID')
      console.log(SingUpService.saveBusinessBank($scope.user))
      SingUpService.createBusinessAccount($scope.user).then(function (organizationId) {
        $state.go('^.step6b')
      }, function (err) {
        console.log('ERROR', err)
        $scope.error = err
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

  $scope.validateDDA = function (f) {
    if (!angular.equals(f.uDDA1.$viewValue, f.uDDA2.$viewValue) || (f.uDDA1.$viewValue === undefined && f.uDDA2.$viewValue === undefined)) {
      f.uDDA2.$setValidity('match', false)
    } else {
      f.uDDA2.$setValidity('match', true)
    }
  }
}]
