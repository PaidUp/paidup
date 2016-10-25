'use strict'
// var angular = require('angular')

module.exports = ['$resource', '$q', '$cookies', '$rootScope', 'UserService', 'SessionService', function ($resource, $q, $cookies, $rootScope, UserService, SessionService) {
  var ProductService = this;
  var getCategories = $resource('/api/v1/commerce/catalog/categories', {}, {})


  var currentUser ={};
  
  ProductService.getPnProducts = function (cb) {
    currentUser = UserService.currentUser;
    if ($cookies.get('pnProds')) {
      var pn = $cookies.get('pnProds') ? JSON.parse($cookies.get('pnProds')) : {};
      var pSuggested = currentUser.meta.productsSuggested ? JSON.parse(currentUser.meta.productsSuggested) : {};
      var merge = JSON.stringify(Object.assign(pSuggested, pn));
      UserService.updateProductsSuggested(currentUser._id, { value: merge }).then(function (newUser) {
        UserService.currentUser = newUser;
        currentUser = newUser;
        ProductService.removePnProducts();
        console.log('newUser.meta.productSuggested: ', newUser.meta.productsSuggested)
        console.log('JSON.parse(newUser.meta.productSuggested)): ', JSON.parse(newUser.meta.productsSuggested))
        cb(null, JSON.parse(newUser.meta.productsSuggested));
      }).catch(function (err) {
        cb(err);
      })

    } else {
      console.log('JSON.parse(currentUser.meta.productSuggested): ', JSON.parse(currentUser.meta.productsSuggested))
      cb(null, JSON.parse(currentUser.meta.productsSuggested));
    }
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
