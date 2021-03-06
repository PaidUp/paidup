'use strict'
// var angular = require('angular')

module.exports = ['$resource', '$q', '$cookies', '$rootScope', 'UserService', 'SessionService', function ($resource, $q, $cookies, $rootScope, UserService, SessionService) {
  var ProductService = this;
  var getCategories = $resource('/api/v1/commerce/catalog/categories', {}, {})
  var prods = null;

  ProductService.saveProductSuggest = function () {
    var pnSession = $cookies.get('pnProds') ? JSON.parse($cookies.get('pnProds')) : null;
    if (pnSession) {
      UserService.get(SessionService.getCurrentSession(), function (currentUser) {
        pnSession['email'] = currentUser.email
        UserService.addProductsSuggested(pnSession).then(function (data) {
          $cookies.remove('pnProds')
        }).catch(function (err) {
          console.log(err)
        })

      })
    }
  }

  ProductService.getPnProducts = function (cb) {
    UserService.get(SessionService.getCurrentSession(), function (currentUser) {
      UserService.getProductsSuggested(currentUser.email).then(function (data) {
        if(data.products.length === 0 && prods){
          data.products.push(prods);
        }
        cb(null, data.products)
      }).catch(function (err) {
        cb(err);
      })
    })
  }

  ProductService.cleanPnProducts = function () {
    if (ProductService.getCleanPnProducts()) {
      UserService.get(SessionService.getCurrentSession(), function (currentUser) {
        UserService.deleteProductsSuggested({ email: currentUser.email }).then(function (result) {
          ProductService.removePnProducts();
          ProductService.removeCleanPnProducts();
        }).catch(function (err) {
          console.log(err)
        })
      })
    }
  }

  ProductService.categories = [];

  ProductService.setPnProducts = function (pnProds) {
    //$cookies.put('pnProds', JSON.stringify(pnProds))
    prods = pnProds;
  }

  ProductService.setCleanPnProducts = function () {
    $cookies.put('cleanPnProds', true)
  }

  ProductService.getCleanPnProducts = function () {
    return $cookies.get('cleanPnProds')
  }

  ProductService.removeCleanPnProducts = function (pnProds) {
    $cookies.remove('cleanPnProds')
  }

  ProductService.removePnProducts = function (pnProds) {
    $cookies.remove('pnProds')
  }

  ProductService.retrieveCategories = function () {
    return getCategories.get({}).$promise;
  }
}]
