'use strict'
// var angular = require('angular')

module.exports = ['$resource', '$q', '$cookies', '$rootScope', 'UserService', 'SessionService', function ($resource, $q, $cookies, $rootScope, UserService, SessionService) {
  var ProductService = this;
  var getCategories = $resource('/api/v1/commerce/catalog/categories', {}, {})

  ProductService.getPnProducts = function (cb) {
    console.log('into get products')
    UserService.get(SessionService.getCurrentSession(), function (currentUser) {
      console.log('get user')
      UserService.getProductsSuggested(currentUser.email).then(function(data){
        console.log('data: ', data)
        if(err){
          return cb(err)
        }
        cb(null, data)
      })
    })
  }

  ProductService.cleanPnProducts = function (cb) {
    UserService.get(SessionService.getCurrentSession(), function (currentUser) {
      UserService.updateProductsSuggested(currentUser._id, { value: '{}' }).then(function (newUser) {
        $rootScope.currentUser = newUser;
        ProductService.removePnProducts();
        cb(null, {});
      }).catch(function (err) {
        cb(err);
      })
    })
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
