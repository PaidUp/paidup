'use strict'

module.exports = [ '$rootScope', '$scope', 'AuthService', '$state', 'CommerceService', function ($rootScope, $scope, AuthService, $state, CommerceService) {
  $scope.orders = []
  $scope.isVisible = false
  AuthService.getCurrentUserPromise().then(function (user) {
    CommerceService.getRecentOrders(user._id, 10).then(function (result) {
      $scope.orders = result.body
      $rootScope.$on('existsAccount', function (event, value) {
        $scope.isVisible = value
      })
    }).catch(function (err) {
      console.log('err', err)
    })
  }).catch(function (err) {
    console.log('err', err)
  })
}]
