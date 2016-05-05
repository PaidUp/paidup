'use strict'
var angular = require('angular')

module.exports = [ '$scope', 'SingUpService', '$state', 'UserService', 'AuthService', 'TrackerService', function ($scope, SingUpService, $state, UserService, AuthService, TrackerService) {
  $scope.user = {}
  var isFacebookSingUp = SingUpService.getFacebookSingUp()
  if (isFacebookSingUp) {
    var currentUser = AuthService.getCurrentUser()
    $scope.user.firstName = currentUser.firstName
    $scope.user.lastName = currentUser.lastName
    // Setting just for the tracker service below
    SingUpService.setCredentials({email: currentUser.email, password1: ''})
  }
  $scope.states = UserService.getStates()
  $scope.loading = false
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.next = function () {
    // Validation start
    var f = $scope.form
    // To fix autocomplete issues
    f.$commitViewValue()
    if (SingUpService.getType() !== 'business') {
      $scope.validateTerms(f)
    }
    SingUpService.runFormControlsValidation(f)
    if (f.$valid) {
      console.log('VALID')
      $scope.loading = true
      var promise
      if (isFacebookSingUp) {
        promise = SingUpService.createPersonalAccountFacebook($scope.user)
      } else {
        promise = SingUpService.createPersonalAccount($scope.user)
      }
      promise.then(function (message) {
        TrackerService.create('signup success', {
          firstName: $scope.user.firstName,
          lastName: $scope.user.lastName,
          email: SingUpService.getUser().credentials.email,
          roleType: AuthService.getIsParent() ? 'Payer' : 'Payee'
        })
        if (SingUpService.getType() === 'business') {
          SingUpService.saveBusinessInfo($scope.user)
          $state.go('^.step6b')
        // $state.go('^.step3b')
        } else {
          $state.go('^.step3p')
        }
      }, function (err) {
        TrackerService.create('signup error', {
          firstName: $scope.user.firstName,
          lastName: $scope.user.lastName,
          email: SingUpService.getUser().credentials.email,
          errorMessage: err.message
        })
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
  $scope.isBusiness = function () {
    return SingUpService.getType() === 'business'
  }

  if ($scope.isBusiness()) {
    $scope.firstNamePlaceholder = 'Legal First Name'
    $scope.lastNamePlaceholder = 'Legal Last Name'
  } else {
    $scope.firstNamePlaceholder = 'First Name'
    $scope.lastNamePlaceholder = 'Last Name'
  }
}]
