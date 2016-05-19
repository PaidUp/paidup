'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'CommerceService', function ($scope, AuthService, $state, CommerceService) {
  $scope.expandSection1 = true
  $scope.expandSection2 = true
  // $scope.allOrdersGroupByProductId = [{'14U': [{o: 1}, {0: 2}]}]
  $scope.allOrders = []
  $scope.allOrdersGroupedByProductId = {
    '14U': {
      productName: '14U',
      total: 2000,
      discount: 0,
      paid: 1000,
      remaining: 1000,
      orders: [1, 2, 3, 4]
    },
    '15U': {
      productName: '15U',
      total: 4000,
      discount: 0,
      paid: 2000,
      remaining: 2000,
      orders: [1, 2, 3]
    },
    '16U': {
      productName: '16U',
      total: 2000,
      discount: 0,
      paid: 1500,
      remaining: 500,
      orders: [1]
    },
    '17U': {
      productName: '17U',
      total: 2000,
      discount: 0,
      paid: 1000,
      remaining: 1000,
      orders: [1, 2]
    }
  }
  AuthService.getCurrentUserPromise().then(function (user) {
    console.log('user', user.meta.productRelated)// acct_17vBpJHXmwMXUx1q - acct_18AQWDGKajSrnujf
    CommerceService.orderGetOrganization('acct_18AQWDGKajSrnujf', 200, -1).then(function (result) {
      console.log('result', result.body)
      $scope.allOrders = result.body
      result.body.map(function (order) {
        console.log('order', order)
        return order
      })
      // $scope.totalPrice = getTotalPrice(result.body)
      // $scope.totalDiscount = getTotalDiscount(result.body)
      // $scope.totalPaid = getTotalPaid(result.body)
      // $scope.totalRemaining = getTotalRemaining(result.body)
    }).catch(function (err) {
      console.log('err', err)
    })
  }).catch(function (err) {
    console.log('err', err)
  })

  function getTotalPrice (orders) {
    return orders.reduce(function (previousPrice, order) {
      return previousPrice + order.paymentsPlan.price
    }, 0) || 0
  }

  function getTotalDiscount (orders) {
    return orders.reduce(function (previousPrice, order) {
      return previousPrice + order.discount
    }, 0) || 0
  }

  function getTotalPaid (orders) {
    return orders.filter(function (order) {
      return order.paymentsPlan.status === 'succeeded'
    }).reduce(function (previousPrice, order) {
      return previousPrice + order.paymentsPlan.price
    }, 0)
  }

  function getTotalRemaining (orders) {
    return orders.filter(function (order) {
      return order.paymentsPlan.status === 'failed' || order.paymentsPlan.status === 'pending'
    }).reduce(function (previousPrice, order) {
      return previousPrice + order.paymentsPlan.price
    }, 0)
  }

  /* function getOrdersGroupByProductId (orders) {
    return orders.reduce(function (prev, order, index, array) {
      // console.log('index', index)
      if (Object.keys(prev).indexOf(order.paymentsPlan.productInfo.productId) === -1) {
        // prev.push({[order.paymentsPlan.productInfo.productId]: order})
        prev[order.paymentsPlan.productInfo.productId] = []
      }
      prev[order.paymentsPlan.productInfo.productId].push(order)
      return prev
    }, []).filter(function (order) {
      // console.log('order', order)
      return !!order
    })
  }*/

  /* function getTotalPriceProduct (orders) {
    return orders.map(function (value) {
      console.log('one value', value)
      return value.reduce(function (sum, pp) {
        console.log('one pp', pp)
        return sum + pp.paymentsPlan.price
      }, 0)
    }, 0)
  }*/

  /* function getDiscountProduct (orders) {
    return orders.map(function (value) {
      console.log('one value', value)
      return value.reduce(function (sum, pp) {
        console.log('one pp', pp)
        return sum + pp.paymentsPlan.discount
      }, 0)
    }, 0)
  }*/

  /* function getPaidProduct (orders) {
    return orders.map(function (order) {
      console.log('getPaidProduct order', order)
      return order.paymentsPlan.status === 'succeeded'
    }).reduce(function (previousPrice, order) {
      return previousPrice + order.paymentsPlan.price
    }, 0)
  }*/

  /* function getRemainingProduct (orders) {
    return orders.filter(function (order) {
      return order.paymentsPlan.status === 'failed' || order.paymentsPlan.status === 'pending'
    }).reduce(function (previousPrice, order) {
      return previousPrice + order.paymentsPlan.price
    }, 0)
  }*/
}]
