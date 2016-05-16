'use strict'

module.exports = [ '$scope', '$rootScope', '$state', 'SetupPaymentService','PaymentService', function ($scope, $rootScope, $state, SetupPaymentService, PaymentService) {
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
    }

    $scope.models = {}

    $scope.total = 0;

  }

  $scope.goStep3 = function(isValid){
    $scope.submit = true;
    if(!isValid){
      $rootScope.GlobalAlertSystemAlerts.push({msg: 'All fields are required', type: 'warning', dismissOnTimeout: 5000})
      return;
    }

    SetupPaymentService.setProductSelected($scope.models.productSelected);
    SetupPaymentService.setPaymentPlanSelected($scope.models.paymentPlanSelected);
    SetupPaymentService.setOrderDetails($scope.orderDetails);

    var params = $scope.models.paymentPlanSelected.dues.map(function(ele){
      //if(applyDiscount) {
      if(false) {
        ele.applyDiscount = true;
        ele.discount = discount;
        ele.couponId = couponId
      }

      return {
        originalPrice: ele.amount,
        stripePercent: $scope.models.productSelected.processingFees.cardFeeDisplay,
        stripeFlat: $scope.models.productSelected.processingFees.cardFeeFlatDisplay,
        paidUpFee: $scope.models.productSelected.collectionsFee.fee,
        discount: ele.applyDiscount ? ele.discount : 0,
        payProcessing: $scope.models.productSelected.paysFees.processing,
        payCollecting: $scope.models.productSelected.paysFees.collections,
        description : ele.description,
        dateCharge : ele.dateCharge
      }
    });

    console.log('#########params: ', params);

    PaymentService.calculateDues(params, function(err, data){
      if(err){

      }
      $scope.schedules = data.prices.map(function(price){
        price.dateCharge = new Date(price.dateCharge)
        $scope.total = $scope.total + price.owedPrice;
        return price;
      });

    })


    console.log('#########');
    console.log('$scope.productSelected',$scope.models.productSelected);
    console.log('$scope.paymentPlanSelected',$scope.models.paymentPlanSelected);
    console.log('$scope.orderDetails',$scope.orderDetails);
    $rootScope.$emit('changePaymentStep', 3)
    $scope.step = 3;
  }

  this.generateDues = function(){

  }

}]
