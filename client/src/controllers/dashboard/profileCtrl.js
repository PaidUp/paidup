'use strict'
var angular = require('angular')

module.exports = [ '$scope', 'UserService', '$timeout', 'TrackerService', 'AuthService', function ($scope, UserService, $timeout, TrackerService, AuthService) {
  $scope.editName = false
  $scope.loading = false
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.states = UserService.getStates()

  $scope.init = function (){
    TrackerService.track('View Profile', {Role: AuthService.getRoleForTrack()});
  }

  $scope.addresses = [
    {
      street: '123 Main St.',
      city: 'Washington',
      state: 'WA',
      zipCode: '44444'
    },
    {
      street: '12344 Ransom Av.',
      city: 'Connecticut',
      state: 'MA',
      zipCode: '55555'
    }
  ]
  $scope.editingAddress = {}
  $scope.editAddress = function (address) {
    $scope.editingAddress = angular.copy(address)
    $scope.showAddressModal = true
  }
  $scope.saveAddress = function () {
    $scope.loading = true
    console.log('saving')
    $timeout(function () {
      $scope.showAddressModal = false
    }, 1000)
  }
  $scope.closeModal = function () {
    $scope.showAddressModal = false
  }
}]
