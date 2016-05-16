'use strict'

module.exports = [ '$scope', '$rootScope', '$state', 'SetupPaymentService', function ($scope, $rootScope, $state, SetupPaymentService) {
  $scope.clickAccount = function () {
    $rootScope.$emit('openAccountsMenu')
  }



  $scope.init = function(){

    $rootScope.$emit('changePaymentStep', 2)
    $scope.step = 2;
    $scope.categorySelected = SetupPaymentService.getCategorySelected();
   // $scope.productSelected = null;

    $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
    $scope.loading = false;

    $scope.orderDetails = {
      athleteFirstName: '',
      athleteLastName: ''
    }


  }

  $scope.goStep3 = function(isValid){
    $scope.submit = true;
    if(!true){
      $rootScope.GlobalAlertSystemAlerts.push({msg: 'All fields are required', type: 'warning', dismissOnTimeout: 5000})
      return;
    }

    SetupPaymentService.setProductSelected($scope.productSelected);
    SetupPaymentService.setPaymentPlanSelected($scope.paymentPlanSelected);
    SetupPaymentService.setOrderDetails($scope.orderDetails);

    //var dues = $scope.paymentPlanSelected.dues;


    console.log('#########');
    console.log('$scope.productSelected',$scope.productSelected);
    console.log('$scope.paymentPlanSelected',$scope.paymentPlanSelected);
    //$rootScope.$emit('changePaymentStep', 3)
    //$scope.step = 3;
  }

  this.generateDues = function(){

  }

}]
