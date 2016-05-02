'use strict'
var angular = require('angular')

module.exports = ['$scope', 'SingUpService', '$state', 'UserService', function ($scope, SingUpService, $state, UserService) {
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
  $scope.user = {}
  $scope.bankAccount = {}
  $scope.maskABA = function () {
    if ($scope.user.routingNumber) {
      $scope.bankAccount.routingNumber = angular.copy($scope.user.routingNumber)
      var temp = ''
      for (var i = 0; i < $scope.user.routingNumber.length; i++) {
        temp += '*'
      }
      $scope.user.routingNumber = temp
    }
  }

  $scope.unmaskABA = function () {
    // console.log('unmaskABA temp', temp)
    if ($scope.bankAccount.routingNumber) {
      $scope.user.routingNumber = angular.copy($scope.bankAccount.routingNumber)
    }
  }

  $scope.ABAValidator = function () {
    // Taken from: http://www.brainjar.com/js/validation/
    $scope.bankAccount.routingNumber = angular.copy($scope.user.routingNumber)
    if (!$scope.bankAccount.routingNumber) {
      $scope.form.uRoutingNumber.$setValidity('aba', false)
      return
    } else {
      $scope.bankAccount.routingNumber = $scope.bankAccount.routingNumber.replace(/ /g, '')
      if ($scope.bankAccount.routingNumber.length !== 9) {
        $scope.form.uRoutingNumber.$setValidity('aba', false)
        return
      }
    }
    var t = $scope.bankAccount.routingNumber.replace(/ /g, '')
    var n = 0
    for (var i = 0; i < t.length; i += 3) {
      n += parseInt(t.charAt(i), 10) * 3 +
        parseInt(t.charAt(i + 1), 10) * 7 +
        parseInt(t.charAt(i + 2), 10)
    }

    // If the resulting sum is an even multiple of ten (but not zero),
    // the aba routing number is good.

    if (n !== 0 && n % 10 === 0) {
      $scope.form.uRoutingNumber.$setValidity('aba', true)
    } else {
      $scope.form.uRoutingNumber.$setValidity('aba', false)
    }
  }
}]
