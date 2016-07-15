'use strict'

module.exports = [ '$scope', '$rootScope', '$state', 'PaymentService', 'AuthService', function ($scope, $rootScope, $state, PaymentService, AuthService) {

  $rootScope.$on('reloadAccountsBox', function (event, data) {
    $scope.init()
  })

  $scope.payments = []

  $scope.init = function () {
    AuthService.getCurrentUserPromise().then(function (user) {
      PaymentService.listCards(user._id).then(function (cards) {
        cards.data.map(function (card) {
          $scope.payments.push(card)
        })
      }).catch(function (err) {
        console.log('ERR', err)
      })
      PaymentService.listBankAccounts(user._id).then(function (banks) {
        banks.data.map(function (bank) {
          $scope.payments.push(bank)
        })
      }).catch(function (err) {
        console.log('ERR', err)
      })
    }).catch(function (err) {
      console.log('err', err)
    })
  }

  $scope.getBrandCardClass = function (brand) {
    return PaymentService.getBrandCardClass(brand)
  }

  $scope.updateAccounts = function () {
    $rootScope.$emit('openAccountsMenu')
  }
}]
