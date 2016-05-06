'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'CommerceService', function ($scope, AuthService, $state, CommerceService) {
  $scope.expandSection1 = true
  $scope.expandSection2 = true
  $scope.allOrders = []
  AuthService.getCurrentUserPromise().then(function (user) {
    CommerceService.orderGet(user._id, 20, -1).then(function (result) {
      $scope.allOrders = result.body.orders
    }).catch(function (err) {
      console.log('err', err)
    })
  }).catch(function (err) {
    console.log('err', err)
  })
}]
