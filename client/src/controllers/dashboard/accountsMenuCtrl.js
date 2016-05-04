'use strict'
var angular = require('angular')

module.exports = [ '$scope', 'UserService', '$timeout', '$rootScope', function ($scope, UserService, $timeout, $rootScope) {
  $scope.loading = false
  $scope.editAccount = false
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.states = UserService.getStates()

  var billingAddress = {
    street: '123 Main St.',
    city: 'Washington',
    state: 'WA',
    zipCode: '44444'
  }

  $scope.accounts = [
    {
      id: '0',
      type: 'visa',
      nameOnCard: 'Robert Redford',
      name: 'Visa - Bank of America',
      last4: 'x-2356',
      expiryDate: '10/17',
      selected: true,
      billingAddress: billingAddress
    },
    {
      id: '1',
      type: 'amex',
      nameOnCard: 'Matias Schiva',
      name: 'American Express',
      last4: 'x-1211',
      expiryDate: '09/23',
      selected: false,
      billingAddress: billingAddress
    }
  ]

  $rootScope.$on('openAccountsMenu', function (event, data) {
    $scope.activeAccountMenu = true
  })

  $scope.modalAccount = {}
  $scope.showAccountModal = false
  $scope.showAccount = function (account) {
    console.log(account)
    $scope.modalAccount = angular.copy(account)
    $scope.showAccountModal = true
  }

  $scope.closeModal = function () {
    $scope.activeAccountMenu = true
    $scope.showAccountModal = false
  }

  $scope.selectAccount = function (accountId) {
    $scope.accounts
    angular.forEach($scope.accounts, function (val) {
      val.selected = false
      if (val.id === accountId) {
        val.selected = true
      }
    })
    $scope.showAccountModal = false
  }
}]
