'use strict'
var angular = require('angular')

module.exports = ['$scope', '$rootScope', '$anchorScroll', '$location', '$q', 'SetupPaymentService', 'PaymentService', 'CommerceService', 'ProductService', 'TrackerService', '$compile', '$stateParams',
  function ($scope, $rootScope, $anchorScroll, $location, $q, SetupPaymentService, PaymentService, CommerceService, ProductService, TrackerService, $compile, $stateParams) {
    $rootScope.$on('loadCardSelected', function (event, data) {
      $scope.card = data
      SetupPaymentService.card = data
    })

    $rootScope.$on('focusBtnCreateOrder', function (event, data) {
      $location.hash('btnCreateOrder')
      $anchorScroll()
    })

    $scope.clickAccount = function () {
      $rootScope.$emit('openAccountsMenuCheckout')
    }

    var steps = {
      find: 1,
      select: 2,
      review: 3,
      pay: 4,
      done: 5
    }

    var pnProducts = {}

    $scope.init = function () {
      ProductService.getPnProducts(function (err, _pnProducts) {
        pnProducts = _pnProducts;
        if (!ProductService.categories) {
          return $location.path('/payment/findOrg')
        }
        ProductService.categories.map(function (category) {
          if (category._id === $stateParams.categoryId) {
            $scope.categorySelected = category
          }
        })
        if (!$scope.categorySelected || !$scope.categorySelected._id) {
          return $location.path('/payment/findOrg')
        }

        $rootScope.$emit('changePaymentStep', steps.select)
        $scope.step = steps.select
        $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
        $scope.loading = false

        $scope.orderDetails = {}
        $scope.models = {}
        $scope.coupon = {}
        $scope.total = 0

        gotoAnchor(steps.select)

        $scope.products = $scope.categorySelected.products.filter(filterProd).sort(compare)
      })

    }

    function compare(a, b) {
      if (a.details.name < b.details.name) return -1
      if (a.details.name > b.details.name) return 1
      return 0
    }

    $scope.onChangeProduct = function () {
      $scope.renderCustomForm = false
      SetupPaymentService.productSelected = $scope.models.productSelected
      $scope.models.paymentPlanSelected = null
      SetupPaymentService.paymentPlanSelected = null
      $scope.schedules = []
      SetupPaymentService.schedules = null
      $scope.total = 0
    }

    $scope.onChangePaymentPlan = function () {
      $scope.loading = true
      $scope.total = 0
      TrackerService.track('Select Payment Plan', { 'PaymentPlanSelected': $scope.models.paymentPlanSelected })
      SetupPaymentService.paymentPlanSelected = $scope.models.productSelected.paymentPlans[$scope.models.paymentPlanSelected]
      SetupPaymentService.paymentPlanSelectedId = $scope.models.paymentPlanSelected
      setPaymentMethods($scope.models.productSelected.paymentPlans[$scope.models.paymentPlanSelected].paymentMethods)

      var paymentMethods = $scope.models.productSelected.paymentPlans[$scope.models.paymentPlanSelected].paymentMethods
      var isBank = (paymentMethods && paymentMethods.length === 1 && paymentMethods[0] === 'bank')

      var params = $scope.models.productSelected.paymentPlans[$scope.models.paymentPlanSelected].dues.map(function (ele) {
        if ($scope.coupon.precent) {
          ele.applyDiscount = true
          ele.discount = $scope.coupon.precent
          ele.couponId = $scope.coupon.code
        }
        return {
          version: ele.version,
          type: isBank ? 'bank_account' : 'card',
          capAmount: $scope.models.productSelected.processingFees.achFeeCapDisplay || 0,
          originalPrice: ele.amount,
          stripePercent: $scope.models.productSelected.processingFees.cardFeeDisplay,
          stripeFlat: $scope.models.productSelected.processingFees.cardFeeFlatDisplay,
          stripeAchPercent: $scope.models.productSelected.processingFees.achFeeDisplay,
          stripeAchFlat: $scope.models.productSelected.processingFees.achFeeFlatDisplay,
          paidUpFee: $scope.models.productSelected.collectionsFee.fee,
          paidUpFlat: $scope.models.productSelected.collectionsFee.feeFlat || 0,
          discount: ele.applyDiscount ? ele.discount : 0,
          payProcessing: $scope.models.productSelected.paysFees.processing,
          payCollecting: $scope.models.productSelected.paysFees.collections,
          description: ele.description,
          dateCharge: ele.dateCharge
        }
      })
      PaymentService.calculateDues(params, function (err, data) {
        if (err) {
          console.log(err)
          $scope.models.paymentPlanSelected = null
          $rootScope.GlobalAlertSystemAlerts.push({
            msg: 'This payment plan is not available',
            type: 'danger',
            dismissOnTimeout: 5000
          })
          $scope.loading = false
        }
        $scope.schedules = data.prices.map(function (price) {
          $scope.total = $scope.total + price.owedPrice
          return price
        })

        var tomorrow = new Date (new Date().setUTCHours(0,0,0,0)+86400000); 

        $scope.todayCharges = $scope.schedules.filter(function(due){
          return new Date(due.dateCharge) < tomorrow
        });

        $scope.comingCharges = $scope.schedules.filter(function(due){
          return new Date(due.dateCharge) >= tomorrow
        });

        
        SetupPaymentService.schedules = $scope.schedules
        $scope.loading = false
      })

      buildDynamicForm()
    }

    function buildDynamicForm() {
      $scope.renderCustomForm = true
      // var count = 0
      var interval = setInterval(function () {
        if (document.getElementById('dynamicForm')) {
          var ele = document.getElementById('dynamicForm')
          $compile(ele)($scope)
          $scope.loading = false
          clearInterval(interval)
        }
      }, 500)
    }

    function setFormFieldsTouched(form) {
      angular.forEach(form.$error, function (field) {
        angular.forEach(field, function (errorField) {
          errorField.$setTouched()
        })
      })
      $rootScope.GlobalAlertSystemAlerts.push({
        msg: 'Please complete required fields.',
        type: 'warning',
        dismissOnTimeout: 5000
      })
    }

    function setPaymentMethods(pm) {
      PaymentService.setDefaultPaymentMethod()
      if (pm && pm.length > 0) {
        if (pm.indexOf('card') === -1) PaymentService.setPaymentMethod('card', false)
        pm.map(function (value) {
          PaymentService.setPaymentMethod(value, true)
        })
      } else {
        PaymentService.setDefaultPaymentMethod()
      }
      return true
    }

    $scope.goStep3 = function () {
      $scope.submit = true
      if ($scope.formStep2.$invalid) {
        setFormFieldsTouched($scope.formStep2)
        return
      }

      if ($scope.dynamicForm && $scope.dynamicForm.$invalid) {
        setFormFieldsTouched($scope.dynamicForm)
        return
      }

      SetupPaymentService.productSelected = $scope.models.productSelected
      $rootScope.$emit('changePaymentStep', steps.review)
      $scope.step = steps.review
      gotoAnchor(steps.review)
    }

    $scope.applyDiscount = function () {
      if ($scope.coupon.code && !$scope.coupon.code.trim().length) {
        $rootScope.GlobalAlertSystemAlerts.push({
          msg: 'Discount code is required',
          type: 'warning',
          dismissOnTimeout: 5000
        })
      } else {
        $scope.loading = true
        PaymentService.applyDiscount($scope.models.productSelected._id, $scope.coupon.code, function (err, data) {
          if (err) {
            $rootScope.GlobalAlertSystemAlerts.push({
              msg: 'Coupon is not valid',
              type: 'warning',
              dismissOnTimeout: 5000
            })
            $scope.loading = false
          } else {
            $rootScope.GlobalAlertSystemAlerts.push({
              msg: 'Coupon was applied successfully',
              type: 'success',
              dismissOnTimeout: 5000
            })
            $scope.coupon.precent = data.percent
            $scope.onChangePaymentPlan()
            $scope.loading = false
          }
        })
      }
    }

    $scope.goStep4 = function () {
      if ($scope.formStep2.$invalid) {
        setFormFieldsTouched($scope.formStep2)
        gotoAnchor(steps.select)
        return
      }

      if ($scope.dynamicForm && $scope.dynamicForm.$invalid) {
        setFormFieldsTouched($scope.dynamicForm)
        gotoAnchor(steps.select)
        return
      }

      SetupPaymentService.productSelected = $scope.models.productSelected
      SetupPaymentService.orderDetails = $scope.orderDetails
      $rootScope.$emit('changePaymentStep', steps.pay)
      $scope.step = steps.pay
      $scope.cards = []

      gotoAnchor(steps.pay)
    }

    $scope.cancel = function () {
      SetupPaymentService.reset()
      $rootScope.$emit('accountMenuReset')
    }

    $scope.createOrder = function () {
      $scope.loading = true
      var params = {
        organizationImage: $scope.categorySelected.image,
        organizationId: $scope.categorySelected._id,
        organizationName: $scope.categorySelected.name,
        organizationLocation: $scope.categorySelected.location,
        productId: $scope.models.productSelected._id,
        productName: $scope.models.productSelected.details.name,
        productImage: $scope.models.productSelected.details.images.main,
        paymentPlanSelected: $scope.models.paymentPlanSelected,
        discount: $scope.coupon.precent ? $scope.coupon.precent : 0,
        couponId: $scope.coupon.precent ? $scope.coupon.code : '',
        beneficiaryId: 'N/A',
        customInfo: $scope.models.productSelected.customInfo,
        typeAccount: $scope.card.object,
        account: $scope.card.id
      }

      CommerceService.createOrder(params).then(function (res) {
        $rootScope.$emit('accountMenuReset')
        SetupPaymentService.resumeOrder = res.body
        $location.path('/payment/thankyou')
        TrackerService.track('Place Order', { 'Payment Type': params.typeAccount })
      }).catch(function (err) {
        console.log(err)
        $rootScope.GlobalAlertSystemAlerts.push({
          msg: 'Oh no, there’s a problem with your order.  Please call us at 855.764.3232 or email us at support@getpaidup.com so we can resolve it.',
          type: 'warning',
          dismissOnTimeout: 5000
        })
        $scope.loading = false
      })
    }

    function gotoAnchor(step) {
      var newHash = 'step' + step
      if ($location.hash() !== newHash) {
        $location.hash(newHash)
      } else {
        $anchorScroll()
      }
    }

    var filterMethods = {
      product: function (product) {
        let pps = {}
        var match = false
        var products = pnProducts.filter(function(pnProd){
          return pnProd.category === $scope.categorySelected._id
        });
        products.forEach(function(prod){
          match = prod.product === '';
          if (!match) {
            match = (prod.product === product._id && product.details.status)
            if (match && prod.paymentPlan && prod.paymentPlan.length > 0) {
              Object.keys(product.paymentPlans).forEach(function (ele) {
                if (ele === prod.paymentPlan) {
                  pps[ele] = product.paymentPlans[ele]
                }
              })
            } else {
              Object.keys(product.paymentPlans).forEach(function (ele) {
                if (product.paymentPlans[ele].visible) {
                  pps[ele] = product.paymentPlans[ele]
                }
              })
            }
          }
        })

        if(Object.keys(pps).length){
          product.paymentPlans = pps;      
        }
        return match
      },
      isActive: function (product) {
        var result = product.details.status && product.details.visibility
        if (result) {
          Object.keys(product.paymentPlans).forEach(function (ele) {
            if (!product.paymentPlans[ele].visible) {
              delete product.paymentPlans[ele]
            }
          })
        }
        return result
      }
    }

    function filterProd(prod) {
      if (pnProducts !== null && pnProducts.length > 0) {
        return filterMethods.product(prod)
      } else {
        return filterMethods.isActive(prod)
      }
    }
  }]
