'use strict'
// var angular = require('angular')

module.exports = [ '$q', 'localStorageService', function ( $q, localStorageService) {

  var service = this;

  service.step = 0;

  service.setCategorySelected = function(categorySelected){
    return localStorageService.set('categorySelected', categorySelected);
  }

  service.getCategorySelected = function(){
    return localStorageService.get('categorySelected');
  }

  service.setProductSelected = function(productSelected){
    return localStorageService.set('productSelected', productSelected);
  }

  service.getProductSelected = function(){
    return localStorageService.get('productSelected');
  }



}]
