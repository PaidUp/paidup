'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'CommerceService', function ($scope, AuthService, $state, CommerceService) {

  $scope.getSubTotal = function getSubTotals (orders, key) {
    return orders.reduce(function (result, order) {
      return result + order[(!key || key !== 'sumPrice') ? 'sumoriginalPrice' : key]
      // return result + order.sumoriginalPrice
    }, 0)
  }

  $scope.getSubTotalDiscount = function getSubTotalDiscount (orders) {
    return orders.reduce(function (result, order) {
      return result + order.sumDiscount
    }, 0)
  }

  $scope.getSubTotalPaid = function getSubTotalPaid (orders, key) {
    return orders.reduce(function (result, order) {
      return result + order.paymentsPlan.reduce(function (previousPrice, pp) {
        var sum = (pp.status === 'succeeded') ? pp[(!key || key !== 'price') ? 'originalPrice' : key] : 0
        // var sum = (pp.status === 'succeeded') ? pp.originalPrice : 0
        return previousPrice + sum
      }, 0)
    }, 0)
  }

  $scope.getSubTotalRemaining = function getSubTotalRemaining (subTotals, key) {
    return subTotals.reduce(function (result, sTotals) {
      return result + sTotals.paymentsPlan.reduce(function (previousPrice, pp) {
        var sum = (pp.status === 'failed' || pp.status === 'pending') ? pp[(!key || key !== 'price') ? 'originalPrice' : key] : 0
        return previousPrice + sum
      }, 0)
    }, 0)
  }

  function init () {
    $scope.expandCategory1 = true
    $scope.expandSection11 = false
    $scope.totalPrice = 0
    $scope.totalPriceFees = 0
    $scope.totalDiscount = 0
    $scope.totalPaid = 0
    $scope.totalPaidFees = 0
    $scope.totalRemaining = 0
    $scope.totalRemainingFees = 0
    $scope.groupProducts = []
    AuthService.getCurrentUserPromise().then(function (user) {
      // user.meta.productRelated[0]) - acct_17vBpJHXmwMXUx1q - acct_18AQWDGKajSrnujf
      let organizationId = (user.meta.productRelated[0]) ? user.meta.productRelated[0] : 'Does not have organization'
      CommerceService.orderGetOrganization(organizationId, 200, -1).then(function (result) {
        $scope.totalPrice = $scope.getSubTotal(result.body)
        $scope.totalPriceFees = $scope.getSubTotal(result.body, 'sumPrice')
        $scope.totalDiscount = $scope.getSubTotalDiscount(result.body)
        $scope.totalPaid = $scope.getSubTotalPaid(result.body)
        $scope.totalPaidFees = $scope.getSubTotalPaid(result.body, 'price')
        $scope.totalRemaining = $scope.getSubTotalRemaining(result.body)
        $scope.totalRemainingFees = $scope.getSubTotalRemaining(result.body, 'price')
        var finalResult = R.groupBy(function (order) {
          return order.allProductName[0]
        })
        $scope.groupProducts = finalResult(result.body)
      }).catch(function (err) {
        console.log('err', err)
      })
    })
  }

  init()
}]
