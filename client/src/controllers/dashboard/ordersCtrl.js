'use strict'

module.exports = ['$scope', 'AuthService', '$state', 'CommerceService', 'TrackerService',
  function ($scope, AuthService, $state, CommerceService, TrackerService) {
    $scope.expandSection1 = true
    $scope.expandSection2 = true
    $scope.allOrders = []
    $scope.init = function(){
      TrackerService.track('View Orders');
    }

    AuthService.getCurrentUserPromise ().then (function (user) {
      CommerceService.orderGet (user._id, 20, -1).then (function (result) {
        $scope.allOrders = result.body.orders
      }).catch (function (err) {
        console.log ('err', err)
      })
    }).catch (function (err) {
      console.log ('err', err)
    })
  }]
