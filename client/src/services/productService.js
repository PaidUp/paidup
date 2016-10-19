'use strict'
// var angular = require('angular')

module.exports = ['$resource', '$q', '$cookies', '$rootScope', 'UserService', function ($resource, $q, $cookies, $rootScope, UserService) {
  var ProductService = this;  
  var getCategories = $resource('/api/v1/commerce/catalog/categories', {}, {})


  ProductService.getPnProducts = function (cb) {
    var currentUser = $rootScope.currentUser;

    if ($cookies.get('pnProds')) {
      var pn = $cookies.get('pnProds') ? JSON.parse($cookies.get('pnProds')) : {};
      var pSuggested = currentUser.meta.productSuggested;
      var merge = Object.assign(pSuggested, pn);
      UserService.updateProductsSuggested(currentUser._id, merge).then(function(newUser){
        $rootScope.currentUser = newUser; 
        ProductService.removePnProducts();
        cb(null, newUser.meta.productSuggested);
      }).catch(function(err){
        cb(err);
      })


    }


    if (currentUser.meta.productSuggested) {

    }

    return pn
  }

  ProductService.categories = [];

  ProductService.setPnProducts = function (pnProds) {
    $cookies.put('pnProds', JSON.stringify(pnProds))
  }

  ProductService.removePnProducts = function (pnProds) {
    $cookies.remove('pnProds')
  }

  ProductService.retrieveCategories = function () {
    return getCategories.get({}).$promise;
  }
}]
