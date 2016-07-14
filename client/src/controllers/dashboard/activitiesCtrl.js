'use strict'

module.exports = ['$scope', 'AuthService', '$state', 'CommerceService', 'TrackerService',
  function ($scope, AuthService, $state, CommerceService, TrackerService) {
    $scope.expandSection1 = false
    $scope.recentOrders = []
    $scope.init = function () {
      //TrackerService.track('View Activity')
    }

    AuthService.getCurrentUserPromise().then(function (user) {
      CommerceService.getRecentOrders(user._id, 10).then(function (result) {
        $scope.recentOrders = result.body
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
