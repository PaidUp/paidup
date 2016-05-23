'use strict'
// var angular = require('angular')

module.exports = ['$resource', '$q', '$cookies', function ($resource, $q, $cookies) {
  var getCategories = $resource('/api/v1/commerce/catalog/categories', {}, {})

  this.getPnProducts = function(){
    return $cookies.get('pnProds')
  }

  this.setPnProducts = function(pnProds){
    $cookies.set('pnProds', pnProds)
  }

  this.retrieveCategories = function () {
    return getCategories.get({}).$promise;
  }
}]
