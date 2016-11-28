'use strict'

module.exports = ['$rootScope', '$scope', 'AuthService', '$state', 'CommerceService', 'TrackerService', 'PaymentService',
  function ($rootScope, $scope, AuthService, $state, CommerceService, TrackerService, PaymentService) {
    $scope.expandSection1 = false
    $scope.expandSection2 = false
    $scope.allOrders = [];
    $scope.loading = true;
    $scope.loader =  "<i ng-show='loading' class='fa fa-circle-o-notch fa-spin'></i>"

    $scope.init = function () {
      AuthService.getCurrentUserPromise().then(function (user) {
        PaymentService.listAccounts(user._id).then(function (Accounts) {
          $scope.payments = Accounts.data
          $scope.loading = false;
        }).catch(function (err) {
          console.log('ERR', err)
        })
      }).catch(function (err) {
        console.log('err', err)
      })
      TrackerService.track('View Orders')
    }

    AuthService.getCurrentUserPromise().then(function (user) {
      CommerceService.orderGet(user._id, 20, -1).then(function (result) {
        $scope.allOrders = result.body.orders
      }).catch(function (err) {
        console.log('err', err)
      })
    }).catch(function (err) {
      console.log('err', err)
    })

    $scope.selectOrder = function (order) {
      if (!$scope.orderSelected || $scope.orderSelected._id !== order._id) {
        $scope.orderSelected = order;
        order.paymentsPlan.forEach(function (pp, idx, arr) {
          if (!pp.paymentMethods || pp.paymentMethods.length === 0) {
           pp.paymentMethods = ['card'];
          }
          pp.accounts = [];
          $scope.payments.forEach(function (acc) {
            for (var pm in pp.paymentMethods) {
              if (acc.object.startsWith(pp.paymentMethods[pm])) { 
                pp.accounts.push(acc.last4)
                break 
              };
            }
          });
        });
      }
    }

    $scope.updateAccount = function(orderId, pp){
      var objAccount;
      $scope.payments.forEach(function (ele) {
        if (pp.last4 == ele.last4) {
          objAccount = ele
        }
      })

      if (!objAccount) {
        $rootScope.GlobalAlertSystemAlerts.push({ msg: 'A payment method is required', type: 'warning', dismissOnTimeout: 5000 })
        pp.last4 = '';
        return
      }

      pp.account = objAccount.id
      pp.accountBrand = objAccount.brand || objAccount.bankName
      pp.last4 = objAccount.last4
      pp.typeAccount = objAccount.object

      var params = {
        version: pp.version || 'v1',
        orderId: orderId,
        paymentPlanId: pp._id,
        originalPrice: pp.originalPrice,
        description: pp.description,
        dateCharge: pp.dateCharge.substring(0, 10) + " 10:00",
        wasProcessed: pp.wasProcessed,
        account: pp.account,
        accountBrand: pp.accountBrand,
        last4: pp.last4,
        typeAccount: pp.typeAccount,
        status: pp.status,
        attempts: pp.attempts
      }

      CommerceService.paymentPlanEdit(params).then(function (res) {
        $rootScope.GlobalAlertSystemAlerts.push({ msg: 'Payment method was updated successfully', type: 'success', dismissOnTimeout: 5000 })
      }).catch(function (err) {
        $rootScope.GlobalAlertSystemAlerts.danger({ msg: 'Payment method cannot be updated, please contact us', type: 'danger', dismissOnTimeout: 5000 })
        console.log('ERR: ', err)
      })

    }

    // DATE PICKER
    $scope.popup1 = {
      opened: false
    }

    $scope.popup2 = {
      opened: false
    }

    $scope.open1 = function () {
      $scope.popup1.opened = true
    }

    $scope.open2 = function () {
      $scope.popup2.opened = true
    }

    $scope.dateOptions1 = {
      maxDate: $scope.dt2,
      showWeeks: false
    }

    $scope.dateOptions2 = {
      minDate: $scope.dt1,
      showWeeks: false
    }

    $scope.change1 = function () {
      var formatOptions = { month: '2-digit', day: '2-digit', year: 'numeric' }
      console.log($scope.dt1.toLocaleDateString('en-US', formatOptions))
      $scope.dateOptions2 = {
        minDate: $scope.dt1,
        showWeeks: false
      }
    }

    $scope.change2 = function () {
      var formatOptions = { month: '2-digit', day: '2-digit', year: 'numeric' }
      console.log($scope.dt2.toLocaleDateString('en-US', formatOptions))
      $scope.dateOptions1 = {
        maxDate: $scope.dt2,
        showWeeks: false
      }
    }
  }]
