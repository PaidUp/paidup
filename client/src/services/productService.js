'use strict'
// var angular = require('angular')

module.exports = ['$resource', '$q', '$cookies', function ($resource, $q, $cookies) {
  var getCategories = $resource('/api/v1/commerce/catalog/categories', {}, {})

  this.getPnProducts = function(){
    var pn = $cookies.get('pnProds') ? JSON.parse($cookies.get('pnProds')) : {};

    return pn
  }

  this.setPnProducts = function(pnProds){
    $cookies.put('pnProds', JSON.stringify(pnProds))
  }

  this.retrieveCategories = function () {
    return getCategories.get({}).$promise;
  }
}]
