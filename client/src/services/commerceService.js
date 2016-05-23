'use strict'
// .service('CommerceService', function ($cookieStore, $resource, $q, $rootScope) {
module.exports = ['$resource', function ($resource) {
  var Orders = $resource('/api/v1/commerce/order/:action/:userId/:limit/:sort', {}, {})
  var orderOrganization = $resource('/api/v1/commerce/order/organization/:action/:organizationId/:limit/:sort', {}, {})

  var CreateOrder = $resource('/api/v1/commerce/order/create', {}, {
    post: { method:'POST', isArray: false }
  });

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

  this.orderGetOrganization = function (organizationId, limit, sort) {
    return orderOrganization.get({ organizationId: organizationId, limit: limit, sort: sort }).$promise
  }

  this.createOrder = function(params){
    return CreateOrder.post(params).$promise;
  }
}]
