'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'CommerceService', function ($scope, AuthService, $state, CommerceService) {
  $scope.expandCategory1 = true
  $scope.expandSection11 = true
  $scope.groupProducts = {
    '14U': {
      productName: '14U',
      total: 2000,
      discount: 0,
      paid: 1000,
      remaining: 1000,
      orders: [{
        createAt: '2016-05-03T06:02:12.692Z',
        productName: 'NY Yankess',
        beneficiaryName: 'Edgar Renteria',
        total: '1000',
        discount: '0',
        paid: '1000',
        remaining: '0',
        orderId: '0001',
        status: '0001',
        pp: [{
          dateCharge: '2016-05-03T06:02:12.692Z',
          description: 'description',
          brand: 'visa',
          last4: '1234',
          originalPrice: 950,
          price: 1000,
          status: 'pending'
        },
        {
          dateCharge: '2016-05-03T06:02:12.692Z',
          description: 'ok',
          brand: 'visa',
          last4: '1234',
          originalPrice: 950,
          price: 1000,
          status: 'failed'
        }]
      }]
    },
    '15U': {
      productName: '15U',
      total: 4000,
      discount: 0,
      paid: 2000,
      remaining: 2000,
      orders: []
    },
    '16U': {
      productName: '16U',
      total: 2000,
      discount: 0,
      paid: 1500,
      remaining: 500,
      orders: []
    },
    '17U': {
      productName: '17U',
      total: 2000,
      discount: 0,
      paid: 1000,
      remaining: 1000,
      orders: []
    }
  }
  AuthService.getCurrentUserPromise().then(function (user) {
    CommerceService.orderGetOrganization(user._id, 20, -1).then(function (result) {
      console.log('result', result.body.orders)
      // $scope.allOrdersBoard = result.body.orders
      console.log('user', user.meta.productRelated)// acct_17vBpJHXmwMXUx1q - acct_18AQWDGKajSrnujf
      CommerceService.orderGetOrganization('acct_18AQWDGKajSrnujf', 200, -1).then(function (result) {
        console.log('result', result.body)
        result.body.map(function (order) {
          console.log('order', order)
          return order
        })
      }).catch(function (err) {
        console.log('err', err)
      })
    }).catch(function (err) {
      console.log('err', err)
    })
  })
}]
