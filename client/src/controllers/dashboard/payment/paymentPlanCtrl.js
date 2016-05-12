'use strict'

module.exports = [ '$scope', '$rootScope', '$state', 'PaymentService', function ($scope, $rootScope, $state, PaymentService) {
  $scope.clickAccount = function () {
    $rootScope.$emit('openAccountsMenu')
  }

  $scope.categorySelected = PaymentService.getCategorySelected();
  $scope.productSelected = null;
  $scope.paymentPlanSelected = null;
  console.log($scope.categorySelected);
  $scope.selectProduct = function(productSelected){
    PaymentService.setProductSelected(productSelected);
    $scope.teamSelected = PaymentService.getProductSelected();
    console.log($scope.teamSelected);
  };

}]
