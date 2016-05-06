'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'CommerceService', function ($scope, AuthService, $state, CommerceService) {
  $scope.activePayments = []
  AuthService.getCurrentUserPromise().then(function (user) {
    CommerceService.getActiveOrders(user._id, 100).then(function (actives) {
      $scope.activePayments = actives.body
    }).catch(function (err) {
      console.log('ERR', err)
    })
  }).catch(function (err) {
    console.log('err', err)
  })
}]
