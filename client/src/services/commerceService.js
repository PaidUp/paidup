'use strict'
// .service('CommerceService', function ($cookieStore, $resource, $q, $rootScope) {
module.exports = ['$resource', function ($resource) {
  var Orders = $resource('/api/v1/commerce/order/:action/:userId/:limit', {}, {})

  this.getRecentOrders = function (userId, limit) {
    return Orders.get({ action: 'recent', userId: userId, limit: limit }).$promise
  }

  this.getNextOrder = function (userId, limit) {
    return Orders.get({ action: 'next', userId: userId, limit: limit }).$promise
  }
}]
