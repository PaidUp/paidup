'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'CommerceService', 'TrackerService', function ($scope, AuthService, $state, CommerceService, TrackerService) {
  $scope.expandSection1 = true
  $scope.expandSection2 = true

  $scope.init = function () {
    TrackerService.track('View Aging')
    AuthService.getCurrentUserPromise().then(function (user) {
      var organizationId = (user.meta.productRelated[0]) ? user.meta.productRelated[0] : 'Does not have organization'
      CommerceService.orderGetOrganization(organizationId, 200, -1).then(function (result) {
        console.log('result1', result.body)
        var test = result.body.map(function (order) {
          // console.log('order', order)
          return order.paymentsPlan.filter(function (pp) {
            // console.log('pp', pp.status)
            return pp.status === 'pending'
          })
        })
        console.log('test', test)
        var groupByProductName = R.groupBy(function (order) {
          return order.allProductName[0]
        })
        console.log('groupByProductrName', groupByProductName(result.body))

        // var groupByPaymentPlan = R.groupBy(function (order) {
          // return order.status
        // })
        // console.log('groupByPaymentPlan', groupByPaymentPlan(groupByProductName(result.body)))
      }).catch(function (err) {
        console.log('err', err)
      })
    })
  }

  $scope.downloadAsCSV = function () {
    TrackerService.track('Download as CSV', {Report: 'Aging'})
  }
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
