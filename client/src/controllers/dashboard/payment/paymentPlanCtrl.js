'use strict'

module.exports = [ '$scope', '$rootScope', '$state', '$anchorScroll', '$location', '$q', 'SetupPaymentService','PaymentService',
  function ($scope, $rootScope, $state, $anchorScroll, $location, $q, SetupPaymentService, PaymentService) {

    $rootScope.$on('loadCardSelected', function (event, data) {
      $scope.card = data;
      SetupPaymentService.setCard(data)
    })

  $scope.clickAccount = function () {
    $rootScope.$emit('openAccountsMenu')
  }

  var steps = {
    find : 1,
    select : 2,
    review : 3,
    pay : 4,
    done : 5
  }

  $scope.init = function(){

    $rootScope.$emit('changePaymentStep', steps.select)
    $scope.step = steps.select;
    $scope.categorySelected = SetupPaymentService.getCategorySelected();
   // $scope.productSelected = null;

    $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
    $scope.loading = false;

    $scope.orderDetails = {
    }

    $scope.models = {}
    $scope.coupon = {}

    $scope.total = 0;

    gotoAnchor(steps.select)

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
      if($scope.coupon.precent) {
        ele.applyDiscount = true;
        ele.discount = $scope.coupon.precent;
        ele.couponId = $scope.coupon.code
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

    $rootScope.$emit('changePaymentStep', steps.review)
    $scope.step = steps.review;
    gotoAnchor(steps.review);
  }

    $scope.applyDiscount = function(){
      if($scope.coupon.code && !$scope.coupon.code.trim().length){
        //TrackerService.create('Apply discount error',{errorMessage : 'Discount code is required'});
        $rootScope.GlobalAlertSystemAlerts.push({msg: 'Discount code is required', type: 'warning', dismissOnTimeout: 5000})
      }else{
        $scope.loading = true;
        PaymentService.applyDiscount($scope.models.productSelected._id, $scope.coupon.code, function(err, data){
          if(err){
            //TrackerService.create('Apply discount error' , {errorMessage : 'Coupon in not valid'});
            $rootScope.GlobalAlertSystemAlerts.push({msg: 'Coupon is not valid', type: 'warning', dismissOnTimeout: 5000});
            $scope.loading = false;
          }
          else{
            //TrackerService.create('Apply discount success',{coupon : $scope.codeDiscounts});
            $rootScope.GlobalAlertSystemAlerts.push({msg: 'Coupon was applied successfully', type: 'success', dismissOnTimeout: 5000})
            $scope.coupon.precent = data.percent;
            $scope.total = 0;
            $scope.goStep3(true);
            $scope.loading = false;
          }
        })
      }}

    $scope.goStep4 = function(){
      $rootScope.$emit('changePaymentStep', steps.pay)
      $scope.step = steps.pay;
      $scope.cards = [];

      gotoAnchor(steps.pay);
    }

    $scope.cancel = function(){
      SetupPaymentService.reset();
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
