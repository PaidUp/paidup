'use strict'
var angular = require('angular')

module.exports = [ '$scope', 'UserService', '$timeout', '$rootScope', function ($scope, UserService, $timeout, $rootScope) {
  $scope.loading = false
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.states = UserService.getStates()
  $scope.modalAccount = {}
  $scope.showAccountModal = false
  $scope.editingAccount = false
  $scope.deletingAccount = false
  $scope.isNewCard = false

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

  $scope.showAccount = function (account) {
    $scope.modalAccount = angular.copy(account)
    $scope.editingAccount = false
    $scope.deletingAccount = false
    $scope.isNewCard = false
    $scope.accountModalTitle = 'Account Details'
    $scope.showAccountModal = true
  }

  $scope.closeModal = function () {
    $scope.showAccountModal = false
  }

  $scope.linkNewCard = function () {
    $scope.modalAccount = {}
    $scope.accountModalTitle = 'Link New Account'
    $scope.isNewCard = true
    $scope.editingAccount = true
    $scope.showAccountModal = true
  }

  $scope.editAccount = function () {
    $scope.accountModalTitle = 'Edit Account Details'
    $scope.isNewCard = false
    $scope.editingAccount = true
  }

  $scope.deleteAccount = function () {
    $scope.accountModalTitle = 'Are you sure you want to delete this Account'
    $scope.deletingAccount = true
  }

  $scope.cancelEditing = function () {
    $scope.editingAccount = false
    if ($scope.isNewCard) {
      $scope.showAccountModal = false
    }
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
