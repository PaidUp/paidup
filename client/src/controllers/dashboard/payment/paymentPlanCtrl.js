'use strict'

module.exports = [ '$scope', '$rootScope', '$state', '$anchorScroll', '$location', 'SetupPaymentService','PaymentService',
  function ($scope, $rootScope, $state, $anchorScroll, $location, SetupPaymentService, PaymentService) {
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

    PaymentService.calculateDues(params, function(err, data){
      if(err){
        console.log(err);
      }
      $scope.schedules = data.prices.map(function(price){
        price.dateCharge = new Date(price.dateCharge)
        $scope.total = $scope.total + price.owedPrice;
        return price;
      });

    })

    $rootScope.$emit('changePaymentStep', 3)
    $scope.step = 3;
    gotoAnchor(3);
  }

    $scope.applyDiscount = function(){
      if(!$scope.codeDiscounts.trim().length){
        //TrackerService.create('Apply discount error',{errorMessage : 'Discount code is required'});
        $rootScope.GlobalAlertSystemAlerts.push({msg: 'Discount code is required', type: 'warning', dismissOnTimeout: 5000})
      }else{
        PaymentService.applyDiscount($scope.productId, $scope.codeDiscounts, function(err, data){
          if(err){
            TrackerService.create('Apply discount error' , {errorMessage : 'Coupon in not valid'});
            FlashService.addAlert({
              type: 'danger',
              msg: 'Coupon is not valid',
              timeout: 10000
            });
          } else{
            TrackerService.create('Apply discount success',{coupon : $scope.codeDiscounts});
            CartController.generateDues(true, data._id, data.percent);
            FlashService.addAlert({
              type: 'success',
              msg: 'Your discount was applied',
              timeout: 5000
            });

          }
        });
      }
    }

    function gotoAnchor(step){
      var newHash = 'step' + step;
      if ($location.hash() !== newHash) {
        $location.hash(newHash);
      } else {
        $anchorScroll();
      }
    }
}]
