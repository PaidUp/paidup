'use strict'

module.exports = [ '$scope', '$state', '$rootScope', '$stateParams', 'ProductService',
  function ($scope, $state, $rootScope, $stateParams, ProductService) {
  // Initialization

    if($rootScope.isCoookieSupported){
      var pnProds = ProductService.getPnProducts();

      if($stateParams.category){
        if(!pnProds[$stateParams.category]){
          pnProds[$stateParams.category] = {};
        }

        if($stateParams.product){
          pnProds[$stateParams.category][$stateParams.product] = {}
        }

        if($stateParams.paymentPlan){
          pnProds[$stateParams.category][$stateParams.product].pp = $stateParams.paymentPlan || ''
        }
        ProductService.setPnProducts(pnProds);
      } else {
        ProductService.removePnProducts();
      }
    }
    $state.go('login');
}]
