'use strict'

module.exports = [ '$scope', '$rootScope', '$state', 'SetupPaymentService', function ($scope, $rootScope, $state, SetupPaymentService) {
  $scope.clickAccount = function () {
    $rootScope.$emit('openAccountsMenu')
  }



  $scope.init = function(){

    $rootScope.$emit('changePaymentStep', 2)
    $scope.step = 2;
    $scope.categorySelected = SetupPaymentService.getCategorySelected();
    $scope.productSelected = null;

    $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
    $scope.loading = false;

    $scope.athleteFirstName = "";
    $scope.athleteLastName  = "";


  }

  $scope.selectProduct = function(productSelected){
    $scope.loading = true;
    delete $scope.paymentPlanSelected;
    SetupPaymentService.setProductSelected(productSelected);
    $scope.productSelected = SetupPaymentService.getProductSelected();
    $scope.loading = false;
  };

  $scope.goStep3 = function(){
    var f = $scope.$forms.formStep2

    $scope.submit = true;
    console.log(f)
    if(f.$valid){
      $rootScope.GlobalAlertSystemAlerts.push({msg: 'All fields are required', type: 'warning', dismissOnTimeout: 5000})
      return;
    }

    $rootScope.$emit('changePaymentStep', 3)
    $scope.step = 3;
  }

}]
