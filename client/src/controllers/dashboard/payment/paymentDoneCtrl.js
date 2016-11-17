'use strict'

module.exports = ['$scope', '$rootScope', '$state', 'SetupPaymentService', 'ProductService', '$location', '$anchorScroll', 'UserService', 'SessionService',
  function ($scope, $rootScope, $state, SetupPaymentService, ProductService, $location, $anchorScroll, UserService, SessionService) {
    $scope.clickAccount = function () {
      $rootScope.$emit('openAccountsMenu')
    }

    $scope.init = function () {
      $rootScope.$emit('changePaymentStep', 5)
      $scope.total = 0;
      $scope.resumeOrder = SetupPaymentService.resumeOrder;

      if (!$scope.resumeOrder.orderId) {
        $state.go('dashboard.summary.components');
      }

      $scope.productSelected = SetupPaymentService.productSelected;
      $scope.schedules = SetupPaymentService.schedules;
      $scope.paymenPlanDescription = SetupPaymentService.paymentPlanSelected.description;
      $scope.orderDetails = SetupPaymentService.orderDetails;
      $scope.categorySelected = SetupPaymentService.categorySelected;
      $scope.schedules.map(function (price) {
        $scope.total = $scope.total + price.owedPrice;
      });

      removePnProduct();

      $location.hash('thanksDone')
      $anchorScroll()
    }

    function removePnProduct() {
      UserService.get(SessionService.getCurrentSession(), function (currentUser) {
        var pnProducts = currentUser.meta.productsSuggested ? JSON.parse(currentUser.meta.productsSuggested) : {};

        if (pnProducts[SetupPaymentService.categorySelected._id]) {
          if (pnProducts[SetupPaymentService.categorySelected._id][SetupPaymentService.productSelected._id]) {
            delete pnProducts[SetupPaymentService.categorySelected._id][SetupPaymentService.productSelected._id]
          }
          if (Object.keys(pnProducts[SetupPaymentService.categorySelected._id]).length === 0) {
            delete pnProducts[SetupPaymentService.categorySelected._id]
          }

        }
        UserService.updateProductsSuggested(currentUser._id, { value: JSON.stringify(pnProducts) }).then(function (newUser) {
          $rootScope.currentUser = newUser;
          ProductService.removePnProducts();
        }).catch(function (err) {
          console.log(err)
        })
      })
    }
  }]
