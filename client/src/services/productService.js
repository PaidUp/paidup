'use strict'
// var angular = require('angular')

module.exports = ['$resource', '$q', '$cookies', '$rootScope', 'UserService', 'SessionService', function ($resource, $q, $cookies, $rootScope, UserService, SessionService) {
  var ProductService = this;
  var getCategories = $resource('/api/v1/commerce/catalog/categories', {}, {})

  ProductService.getPnProducts = function (cb) {
    UserService.get(SessionService.getCurrentSession(), function (currentUser) {

      if ($cookies.get('pnProds')) {
        var pn = $cookies.get('pnProds') ? JSON.parse($cookies.get('pnProds')) : {};
        var pSuggested = {};
        if (currentUser.meta.productsSuggested) {
          pSuggested = JSON.parse(currentUser.meta.productsSuggested)
        }
        var pSuggested = currentUser.meta.productsSuggested ? JSON.parse(currentUser.meta.productsSuggested) : {};

        for (var key in pn) {
          if (!pSuggested[key]) {
            pSuggested[key] = {};
          }
          for (var keyP in pn[key]) {
            if (!pSuggested[key][keyP]) {
              pSuggested[key][keyP] = pn[key][keyP]
            }
          }
        }
        UserService.updateProductsSuggested(currentUser._id, { value: JSON.stringify(pSuggested) }).then(function (newUser) {
          $rootScope.currentUser = newUser;
          ProductService.removePnProducts();
          cb(null, JSON.parse(newUser.meta.productsSuggested));
        }).catch(function (err) {
          cb(err);
        })

      } else {
        cb(null, JSON.parse(currentUser.meta.productsSuggested));
      }
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
