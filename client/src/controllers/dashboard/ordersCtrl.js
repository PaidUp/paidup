'use strict'

module.exports = ['$scope', 'AuthService', '$state', 'CommerceService', 'TrackerService',
  function ($scope, AuthService, $state, CommerceService, TrackerService) {
    $scope.expandSection1 = true
    $scope.expandSection2 = true
    $scope.allOrders = []
    $scope.init = function () {
      TrackerService.track('View Orders')
    }

    AuthService.getCurrentUserPromise().then(function (user) {
      CommerceService.orderGet(user._id, 20, -1).then(function (result) {
        $scope.allOrders = result.body.orders
      }).catch(function (err) {
        console.log('err', err)
      })
    }).catch(function (err) {
      console.log('err', err)
    })

    // DATE PICKER
    $scope.popup1 = {
      opened: false
    }

    $scope.popup2 = {
      opened: false
    }

    $scope.open1 = function () {
      $scope.popup1.opened = true
    }

    $scope.open2 = function () {
      $scope.popup2.opened = true
    }

    $scope.dateOptions1 = {
      maxDate: $scope.dt2,
      showWeeks: false
    }

    $scope.dateOptions2 = {
      minDate: $scope.dt1,
      showWeeks: false
    }

    $scope.change1 = function () {
      var formatOptions = { month: '2-digit', day: '2-digit', year: 'numeric' }
      console.log($scope.dt1.toLocaleDateString('en-US', formatOptions))
      $scope.dateOptions2 = {
        minDate: $scope.dt1,
        showWeeks: false
      }
    }

    $scope.change2 = function () {
      var formatOptions = { month: '2-digit', day: '2-digit', year: 'numeric' }
      console.log($scope.dt2.toLocaleDateString('en-US', formatOptions))
      $scope.dateOptions1 = {
        maxDate: $scope.dt2,
        showWeeks: false
      }
    }
  }]
