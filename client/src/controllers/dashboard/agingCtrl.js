'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'CommerceService', 'TrackerService', function ($scope, AuthService, $state, CommerceService, TrackerService) {
  $scope.expandSection1 = true
  $scope.expandSection2 = true
  $scope.overDue0130 = 0
  $scope.overDue3160 = 0
  $scope.overDue6190 = 0
  $scope.overDue9100 = 0
  $scope.overDueTotal = 0
  $scope.ordersOverDues = []

  function filterpaymentsPlan (pps, status) {
    var now = new Date()
    return pps.filter(function (pp) {
      return (pp.status === 'pending' || pp.status === 'failed') && new Date(pp.dateCharge) <= now && status === 'active'
    })
  }

  function getDueOrders (orders) {
    return orders.map(function (order) {
      return {orderId: order.orderId, createAt: order.createAt, allProductName: order.allProductName, paymentsPlan: filterpaymentsPlan(order.paymentsPlan, order.status)}
    }).filter(function (obj) {
      return obj.paymentsPlan.length > 0
    })
  }

  $scope.getTotalDue = function getTotalDue (orders) {
    return orders.map(function (order) {
      return order.paymentsPlan.reduce(function (totalDue, pp) {
        return totalDue + pp.price
      }, 0)
    }).reduce(function (total, dues) {
      return total + dues
    }, 0)
  }

  function getDates (dateCharge, leftLimit, rightLimit) {
    var me = new Date()
    return new Date(dateCharge) > new Date(new Date(me).setMonth(new Date(me).getMonth() - leftLimit)) && new Date(dateCharge) < new Date(new Date(me).setMonth(new Date(me).getMonth() - rightLimit))
  }

  $scope.getTotalDues = function get0130Due (orders, left, right) {
    return orders.map(function (order) {
      return order.paymentsPlan.reduce(function (totalDue, pp) {
        return getDates(pp.dateCharge, left, right) ? totalDue + pp.price : totalDue
      }, 0)
    }).reduce(function (total, dues) {
      return total + dues
    }, 0)
  }

  $scope.getBeneficiaryInfo = function getBeneficiaryInfo (formData) {
    var ret = ''
    for (var prop in formData) {
      ret = ret + ' ' + formData[prop]
    }
    return ret
  }

  $scope.init = function () {
    TrackerService.track('View Aging')
    AuthService.getCurrentUserPromise().then(function (user) {
      var organizationId = (user.meta.productRelated[0]) ? user.meta.productRelated[0] : 'Does not have organization'
      CommerceService.orderGetOrganization(organizationId, 200, -1).then(function (result) {
        var groupByProductName = R.groupBy(function (order) {
          return order.allProductName[0]
        })
        var dueOrders = getDueOrders(result.body)
        $scope.overDueTotal = $scope.getTotalDue(dueOrders)
        $scope.overDue0130 = $scope.getTotalDues(dueOrders, 1, 0)
        $scope.overDue3160 = $scope.getTotalDues(dueOrders, 2, 1)
        $scope.overDue6190 = $scope.getTotalDues(dueOrders, 3, 2)
        $scope.overDue9100 = $scope.getTotalDues(dueOrders, 12, 3)
        $scope.ordersOverDues = groupByProductName(dueOrders)
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
