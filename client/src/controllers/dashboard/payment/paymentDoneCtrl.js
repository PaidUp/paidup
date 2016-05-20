'use strict'

module.exports = [ '$scope', '$rootScope', '$state', 'SetupPaymentService', function ($scope, $rootScope, $state, SetupPaymentService) {
  $scope.clickAccount = function () {
    $rootScope.$emit('openAccountsMenu')
  }

  $scope.init = function(){
    $rootScope.$emit('changePaymentStep', 5)
    $scope.total = 0;
    $scope.resumeOrder = SetupPaymentService.resumeOrder;

    if(!$scope.resumeOrder.orderId){
      $state.go('dashboard.summary.components');
    }

    $scope.schedules = SetupPaymentService.schedules;
    $scope.paymenPlanDescription = SetupPaymentService.paymentPlanSelected.description;
    $scope.orderDetails = SetupPaymentService.orderDetails;
    $scope.categorySelected = SetupPaymentService.categorySelected;
    $scope.schedules.map(function(price){
      $scope.total = $scope.total + price.owedPrice;
    });


  }




}]
