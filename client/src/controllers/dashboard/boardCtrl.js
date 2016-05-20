'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'CommerceService', function ($scope, AuthService, $state, CommerceService) {
  $scope.expandCategory1 = true
  $scope.expandSection11 = false
  $scope.totalPrice = 0
  $scope.totalDiscount = 0
  $scope.totalPaid = 0
  $scope.totalRemaining = 0
  $scope.groupProducts = []
  AuthService.getCurrentUserPromise().then(function (user) {
    CommerceService.orderGetOrganization(user._id, 20, -1).then(function (result) {
      // console.log('user', user.meta.productRelated)// acct_17vBpJHXmwMXUx1q - acct_18AQWDGKajSrnujf
      CommerceService.orderGetOrganization(user.meta.productRelated[0], 200, -1).then(function (result) {
        $scope.totalPrice = getTotalPrice(result.body)
        $scope.totalDiscount = getTotalDiscount(result.body)
        $scope.totalPaid = getTotalPaid(result.body)
        $scope.totalRemaining = getTotalRemaining(result.body)
        var finalResult = R.groupBy(function (order) {
          return order.allProductName[0]
        })
        $scope.groupProducts = finalResult(result.body)
        // var temp = finalResult(result.body)
        // console.log('temp', temp)
        // console.log('result', result.body)
      }).catch(function (err) {
        console.log('err', err)
      })
    }).catch(function (err) {
      console.log('err', err)
    })
  })

  $scope.getSubTotal = function getSubTotal (subTotals) {
    return subTotals.reduce(function (result, sTotals) {
      return result + sTotals.sumoriginalPrice
    }, 0)
  }

  $scope.getSubTotalDiscount = function getSubTotalDiscount (subTotals) {
    return subTotals.reduce(function (result, sTotals) {
      return result + sTotals.sumDiscount
    }, 0)
  }

  $scope.getSubTotalPaid = function getSubTotalPaid (orders) {
    return orders.reduce(function (result, order) {
      return result + order.paymentsPlan.reduce(function (previousPrice, pp) {
        var sum = (pp.status === 'succeeded') ? pp.originalPrice : 0
        return previousPrice + sum
      }, 0)
    }, 0)
  }

  $scope.getSubTotalRemaining = function getSubTotalRemaining (subTotals) {
    return subTotals.reduce(function (result, sTotals) {
      return result + sTotals.paymentsPlan.reduce(function (previousPrice, pp) {
        var sum = (pp.status === 'failed' || pp.status === 'pending') ? pp.originalPrice : 0
        return previousPrice + sum
      }, 0)
    }, 0)
  }

  function getTotalPrice (orders) {
    return orders.reduce(function (previousPrice, order) {
      return previousPrice + order.sumoriginalPrice
    }, 0)
  }

  function getTotalDiscount (orders) {
    return orders.reduce(function (previousPrice, order) {
      return previousPrice + order.sumDiscount
    }, 0)
  }

  function getTotalPaid (orders) {
    return orders.reduce(function (total, order) {
      return total + order.paymentsPlan.reduce(function (previousPrice, pp) {
        var sum = (pp.status === 'succeeded') ? pp.originalPrice : 0
        return previousPrice + sum
      }, 0)
    }, 0)
  }

  function getTotalRemaining (orders) {
    return orders.reduce(function (total, order) {
      return total + order.paymentsPlan.reduce(function (previousPrice, pp) {
        var sum = (pp.status === 'failed' || pp.status === 'pending') ? pp.originalPrice : 0
        return previousPrice + sum
      }, 0)
    }, 0)
  }

  $scope.getSubTotalPaidOrder = function getSubTotalPaidOrder (order) {
    return order.paymentsPlan.reduce(function (previousPrice, pp) {
      var sum = (pp.status === 'succeeded') ? pp.originalPrice : 0
      return previousPrice + sum
    }, 0)
  }

  $scope.getSubTotalRemainingOrder = function getSubTotalPaidOrder (order) {
    return order.paymentsPlan.reduce(function (previousPrice, pp) {
      var sum = (pp.status === 'failed' || pp.status === 'pending') ? pp.originalPrice : 0
      return previousPrice + sum
    }, 0)
  }
}]
