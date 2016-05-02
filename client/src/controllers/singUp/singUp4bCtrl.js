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

  $scope.user = {}
  $scope.bankAccount = {}
  $scope.validateDDA = function (f) {
    console.log('validateDDA $scope.bankAccount', $scope.bankAccount)
    if (!angular.equals($scope.bankAccount.dda1, $scope.bankAccount.dda2) || ($scope.bankAccount.dda1 === undefined && $scope.bankAccount.dda2 === undefined)) {
      f.uDDA2.$setValidity('match', false)
    } else {
      f.uDDA2.$setValidity('match', true)
    }
  }

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

  $scope.maskDDA = function () {
    if ($scope.user.DDA1) {
      $scope.bankAccount.dda1 = angular.copy($scope.user.DDA1)
      var temp = ''
      for (var i = 0; i < $scope.user.DDA1.length; i++) {
        temp += '*'
      }
      $scope.user.DDA1 = temp
    }
  }

  $scope.unmaskDDA = function () {
    if ($scope.bankAccount.dda1) {
      $scope.user.DDA1 = angular.copy($scope.bankAccount.dda1)
    }
  }

  $scope.maskDDA2 = function () {
    if ($scope.user.DDA2) {
      $scope.bankAccount.dda2 = angular.copy($scope.user.DDA2)
      var temp = ''
      for (var i = 0; i < $scope.user.DDA2.length; i++) {
        temp += '*'
      }
      $scope.user.DDA2 = temp
    }
  }

  $scope.unmaskDDA2 = function () {
    if ($scope.bankAccount.dda2) {
      $scope.user.DDA2 = angular.copy($scope.bankAccount.dda2)
    }
  }

  $scope.validateDDA1 = function () {
    $scope.bankAccount.dda1 = angular.copy($scope.user.DDA1)
    if ($scope.bankAccount.dda1) {
      var pattern = /^\d{4,}$/
      $scope.form.uDDA1.$setValidity('pattern', pattern.test($scope.bankAccount.dda1.replace(/ /g, '')))
    } else {
      $scope.form.uDDA1.$setValidity('pattern', false)
    }
  }

  $scope.validateDDA2 = function () {
    console.log('validateDDA2 $scope.bankAccount0', $scope.bankAccount)
    $scope.bankAccount.dda2 = angular.copy($scope.user.DDA2)
    console.log('validateDDA2 $scope.bankAccount1', $scope.bankAccount)
    if ($scope.bankAccount.dda2) {
      if ($scope.bankAccount.dda1.replace(/ /g, '') !== $scope.bankAccount.dda2.replace(/ /g, '')) {
        $scope.form.uDDA2.$setValidity('match', false)
      } else {
        $scope.form.uDDA2.$setValidity('match', true)
      }
    }
  }
}]
