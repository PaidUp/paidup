'use strict'

module.exports = [ '$scope', '$rootScope', '$state', 'SetupPaymentService', function ($scope, $rootScope, $state, SetupPaymentService) {
  $scope.clickAccount = function () {
    $rootScope.$emit('openAccountsMenu')
  }

  $scope.init = function(){
    $rootScope.$emit('changePaymentStep', 5)
    $scope.total = 0;
    $scope.resumeOrder = SetupPaymentService.getResumeOrder();

    if(!$scope.resumeOrder.orderId){
      $state.go('dashboard.summary.components');
    }

    $scope.schedules = SetupPaymentService.getSchedules();
    $scope.paymenPlanDescription = SetupPaymentService.getPaymentPlanSelected().description;
    $scope.orderDetails = SetupPaymentService.getOrderDetails();
    $scope.categorySelected = SetupPaymentService.getCategorySelected();
    $scope.schedules.map(function(price){
      $scope.total = $scope.total + price.owedPrice;
    });


    console.log('resumeOrder: ' , $scope.resumeOrder)
  }




}]
