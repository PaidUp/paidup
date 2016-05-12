'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'CommerceService', function ($scope, AuthService, $state, CommerceService) {
  $scope.expandSection1 = true
  $scope.expandSection2 = true
  $scope.allOrdersBoard = []
  AuthService.getCurrentUserPromise().then(function (user) {
    console.log('user', user)
    CommerceService.orderGetOrganization(user._id, 20, -1).then(function (result) {
      console.log('result', result.body.orders)
      // $scope.allOrdersBoard = result.body.orders
    }).catch(function (err) {
      console.log('err', err)
    })
  }).catch(function (err) {
    console.log('err', err)
  })
}]
