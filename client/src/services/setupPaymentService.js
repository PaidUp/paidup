'use strict'
// var angular = require('angular')

module.exports = [ '$q', 'localStorageService', function ( $q, localStorageService) {

  var service = this;

  function init() {
    service.resumeOrder = {}
    service.schedules = []
    service.categorySelected = {}
    service.productSelected = {}
    service.paymentPlanSelected = {}
    service.orderDetails = {}
    service.card = {}
  };

  init();

  service.reset = function(){
    init();
  }

}]
