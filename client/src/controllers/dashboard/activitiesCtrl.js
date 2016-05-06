'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'CommerceService', function ($scope, AuthService, $state, CommerceService) {
  $scope.expandSection1 = false
  $scope.recentOrders = []
  AuthService.getCurrentUserPromise().then(function (user) {
    CommerceService.getRecentOrders(user._id, 10).then(function (result) {
      $scope.recentOrders = result.body
    }).catch(function (err) {
      console.log('err', err)
    })
  }).catch(function (err) {
    console.log('err', err)
  })
}]
