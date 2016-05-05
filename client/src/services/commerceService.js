'use strict'
// .service('CommerceService', function ($cookieStore, $resource, $q, $rootScope) {
module.exports = ['$resource', function ($resource) {
  var Orders = $resource('/api/v1/commerce/order/recent/:userId/:limit', {}, {})
  // var Order = $resource('/api/v1/commerce/order/:orderId', {}, {})
  // var Transactions = $resource('/api/v1/commerce/transaction/list', {}, {})
  // var Provider = $resource('/api/v1/commerce/provider/request', {}, {})
  // var Schedule = $resource('/api/v1/commerce/schedule/generate', {}, {
    // post: { method: 'POST', isArray: false }
  // })
  // var CreateOrder = $resource('/api/v1/commerce/order/create', {}, {
    // post: { method: 'POST', isArray: false }
  // })

  this.getRecentOrders = function (userId, limit) {
    return Orders.get({ userId: userId, limit: limit }).$promise
  }

  // this.getOrder = function (orderId) {
    // return Order.get({ orderId: orderId }).$promise
  // }

  // this.getUsertransactions = function () {
    // return Transactions.query().$promise
  // }

  // this.getSchedule = function (productId, price, isInFullPay, discount) {
    // return Schedule.post({ productId: productId, price: price, isInFullPay: isInFullPay, discount: discount }).$promise
  // }

  // this.createOrder = function (params) {
    // return CreateOrder.post(params).$promise
  // }
}]
