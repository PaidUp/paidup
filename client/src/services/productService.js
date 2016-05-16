'use strict'
// var angular = require('angular')

module.exports = ['$resource', '$q', function ($resource, $q) {
  var getCategories = $resource('/api/v1/commerce/catalog/categories', {}, {})

  this.retrieveCategories = function () {
    return getCategories.get({}).$promise;
  }
}]
