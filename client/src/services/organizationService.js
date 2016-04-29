'use strict'
// var angular = require('angular')

module.exports = ['$resource', '$q', function ($resource, $q) {
  var Organization = $resource('/api/v1/organization/:action/:id', {}, {})

  this.organizationRequest = function (organizationInfo, userId) {
    return Organization.save({ action: 'request' }, { organizationInfo: organizationInfo, userId: userId }).$promise
  }

  this.organizationResponse = function (organizationId) {
    return Organization.get({ action: 'response', id: organizationId }).$promise
  }
}]
