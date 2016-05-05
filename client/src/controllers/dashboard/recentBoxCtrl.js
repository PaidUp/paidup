'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'CommerceService', function ($scope, AuthService, $state, CommerceService) {
  $scope.orders = []
  AuthService.getCurrentUserPromise().then(function (user) {
    CommerceService.getRecentOrders(user._id, 10).then(function (result) {
      $scope.orders = result.body
    }).catch(function (err) {
      console.log('err', err)
    })
  }).catch(function (err) {
    console.log('err', err)
  })
}]
