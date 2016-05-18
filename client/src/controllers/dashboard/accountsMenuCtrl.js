'use strict'
var angular = require('angular')

module.exports = [ '$scope', 'UserService', '$timeout', '$rootScope', 'AuthService', 'PaymentService', function ($scope, UserService, $timeout, $rootScope, AuthService, PaymentService) {
  $scope.accounts = []
  $scope.loading = false
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.states = UserService.getStates()
  $scope.modalAccount = {}
  $scope.showAccountModal = false
  $scope.editingAccount = false
  $scope.deletingAccount = false
  $scope.isNewCard = false

  $scope.init = function(){
    init();
  }

  function init(){
    AuthService.getCurrentUserPromise().then(function (user) {
      PaymentService.listCards(user._id).then(function (accounts) {
        $scope.accounts = accounts.data
      }).catch(function (err) {
        console.log('ERR', err)
      })
    }).catch(function (err) {
      console.log('err', err)
    })
  }


  $rootScope.$on('openAccountsMenu', function (event, data) {
    $scope.activeAccountMenu = true
  })

  $rootScope.$on('accountMenuReset', function (event, data) {
    $scope.accounts = [];
    init();
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
        $rootScope.$emit('loadCardSelected', val);
      }
    })
    $scope.showAccountModal = false
    $scope.activeAccountMenu = false

  }


}]
