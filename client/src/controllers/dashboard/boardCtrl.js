'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'CommerceService', function ($scope, AuthService, $state, CommerceService) {

  $scope.getSubTotal = function getSubTotals (orders) {
    return orders.reduce(function (result, order) {
      return result + order.sumoriginalPrice
    }, 0)
  }

  $scope.getSubTotalDiscount = function getSubTotalDiscount (orders) {
    return orders.reduce(function (result, order) {
      return result + order.sumDiscount
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

  function init () {
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
          $scope.totalPrice = $scope.getSubTotal(result.body)
          $scope.totalDiscount = $scope.getSubTotalDiscount(result.body)
          $scope.totalPaid = $scope.getSubTotalPaid(result.body)
          $scope.totalRemaining = $scope.getSubTotalRemaining(result.body)
          var finalResult = R.groupBy(function (order) {
            return order.allProductName[0]
          })
          $scope.groupProducts = finalResult(result.body)
        }).catch(function (err) {
          console.log('err', err)
        })
      }).catch(function (err) {
        console.log('err', err)
      })
    })
  }

  init()
}]
