'use strict'

module.exports = [ '$scope', '$rootScope', '$state', 'PaymentService', 'AuthService', function ($scope, $rootScope, $state, PaymentService, AuthService) {
  $scope.payments = [] // [{name: 'test', last4: 'xxx1', brand: 'visa'}, {name: 'test2', last4: 'xxx2', brand: 'amex'}]
  // var userId = 'userId'
  AuthService.getCurrentUserPromise().then(function (user) {
    PaymentService.listCards(user._id).then(function (cards) {
      $scope.payments = cards.data
    }).catch(function (err) {
      console.log('ERR', err)
    })
  }).catch(function (err) {
    console.log('err', err)
  })

  $scope.updateAccounts = function () {
    $rootScope.$emit('openAccountsMenu')
  }
}]
