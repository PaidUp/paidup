'use strict'
// .service('CommerceService', function ($cookieStore, $resource, $q, $rootScope) {
module.exports = ['$resource', function ($resource) {
  var Orders = $resource('/api/v1/commerce/order/:action/:userId/:limit/:sort', {}, {})

  this.getRecentOrders = function (userId, limit) {
    return Orders.get({ action: 'recent', userId: userId, limit: limit }).$promise
  }

  this.getNextOrder = function (userId, limit) {
    return Orders.get({ action: 'next', userId: userId, limit: limit }).$promise
  }

  this.getActiveOrders = function (userId, limit) {
    return Orders.get({ action: 'active', userId: userId, limit: limit }).$promise
  }

  this.orderGet = function (userId, limit, sort) {
    return Orders.get({ userId: userId, limit: limit, sort: sort }).$promise
  }
}]
