'use strict'

module.exports = [ '$scope', '$rootScope', '$state', 'SetupPaymentService', 'ProductService', '$location', '$anchorScroll', function ($scope, $rootScope, $state, SetupPaymentService, ProductService, $location, $anchorScroll) {
  $scope.clickAccount = function () {
    $rootScope.$emit('openAccountsMenu')
  }

  $scope.init = function(){
    $location.hash('thanksDone')
    $anchorScroll()
    $rootScope.$emit('changePaymentStep', 5)
    $scope.total = 0;
    $scope.resumeOrder = SetupPaymentService.resumeOrder;

    if(!$scope.resumeOrder.orderId){
      $state.go('dashboard.summary.components');
    }

    $scope.productSelected = SetupPaymentService.productSelected;
    $scope.schedules = SetupPaymentService.schedules;
    $scope.paymenPlanDescription = SetupPaymentService.paymentPlanSelected.description;
    $scope.orderDetails = SetupPaymentService.orderDetails;
    $scope.categorySelected = SetupPaymentService.categorySelected;
    $scope.schedules.map(function(price){
      $scope.total = $scope.total + price.owedPrice;
    });

    removePnProduct();
  }

  function removePnProduct(){
    var pnProducts = ProductService.getPnProducts();
    if(pnProducts[SetupPaymentService.categorySelected._id]){
      if(pnProducts[SetupPaymentService.categorySelected._id][SetupPaymentService.productSelected._id]){
        delete pnProducts[SetupPaymentService.categorySelected._id][SetupPaymentService.productSelected._id]
      }
      if(Object.keys(pnProducts[SetupPaymentService.categorySelected._id]).length === 0 ){
        delete pnProducts[SetupPaymentService.categorySelected._id]
      }

    }
    ProductService.setPnProducts(pnProducts);
  }

}]
