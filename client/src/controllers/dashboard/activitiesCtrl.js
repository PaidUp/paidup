'use strict'

module.exports = ['$scope', 'AuthService', '$state', 'CommerceService', 'TrackerService',
  function ($scope, AuthService, $state, CommerceService, TrackerService) {
    $scope.expandSection1 = false
    $scope.recentOrders = []
    $scope.init = function () {
      TrackerService.track('View Activity')
    }


    AuthService.getCurrentUserPromise ().then (function (user) {
      CommerceService.getRecentOrders (user._id, 10).then (function (result) {
        $scope.recentOrders = result.body
      }).catch (function (err) {
        console.log ('err', err)
      })
    }).catch (function (err) {
      console.log ('err', err)
    })
  }]
