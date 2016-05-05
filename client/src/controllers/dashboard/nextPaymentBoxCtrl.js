'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'CommerceService', function ($scope, AuthService, $state, CommerceService) {
  $scope.nextPaymets = []
  AuthService.getCurrentUserPromise().then(function (user) {
    CommerceService.getNextOrder(user._id, 10).then(function (next) {
      $scope.nextPaymets = (next.body.length > 0) ? [next.body[0]] : []
    }).catch(function (err) {
      console.log('ERR', err)
    })
  }).catch(function (err) {
    console.log('err', err)
  })
}]
