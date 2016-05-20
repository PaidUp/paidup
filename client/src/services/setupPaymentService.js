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

  service.setPaymentPlanSelected = function(paymentPlanSelected){
    return localStorageService.set('paymentPlanSelected', paymentPlanSelected);
  }

  service.getPaymentPlanSelected = function(){
    return localStorageService.get('paymentPlanSelected');
  }

  service.setOrderDetails = function(orderDetails){
    return localStorageService.set('orderDetails', orderDetails);
  }

  service.getOrderDetails = function(){
    return localStorageService.get('orderDetails');
  }

  service.setCard = function(card){
    return localStorageService.set('card', card);
  }

  service.getCard = function(){
    return localStorageService.get('card');
  }

  service.reset = function(){
    return localStorageService.clearAll();
  }


}]
