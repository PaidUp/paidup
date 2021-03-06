'use strict'

module.exports = ['$rootScope', '$scope', 'AuthService', '$state', 'CommerceService', 'TrackerService', 'PaymentService', '$stateParams',
  function ($rootScope, $scope, AuthService, $state, CommerceService, TrackerService, PaymentService, $stateParams) {
    $scope.expandSection1 = false
    $scope.expandSection2 = false
    $scope.allOrders = [];
    $scope.loading = true;
    $scope.loader = "<i ng-show='loading' class='fa fa-circle-o-notch fa-spin'></i>"

    $rootScope.$on('reloadAccountsOrder', function (event, data) {
      $scope.loading = true;
      $stateParams.orderId = $scope.orderSelected.orderId;
      $scope.init()
    })

    $scope.init = function () {
      AuthService.getCurrentUserPromise().then(function (user) {
        PaymentService.listAccounts(user._id).then(function (Accounts) {

          $scope.payments = Accounts.data
          
          CommerceService.orderGet(user._id, 20, -1).then(function (result) {
            if ($stateParams.orderId) {
              $scope.allOrders = result.body.orders.filter(function (order) {
                var res = order.orderId === $stateParams.orderId;
                if(res){
                  $scope.selectOrder(order, true);
                }
                return res
              })
            } else {
              $scope.allOrders = result.body.orders
            }
          }).catch(function (err) {
            console.log('err', err)
          })

          $scope.loading = false;
        }).catch(function (err) {
          console.log('ERR', err)
        })
      }).catch(function (err) {
        console.log('err', err)
      })
      TrackerService.track('View Orders')
    }

    $scope.selectOrder = function (order, reload) {
      if (reload || !$scope.orderSelected || $scope.orderSelected._id !== order._id) {
        $scope.orderSelected = order;
        order.paymentsPlan.forEach(function (pp, idx, arr) {
          if (!pp.paymentMethods || pp.paymentMethods.length === 0) {
            pp.paymentMethods = ['card'];
          }
          pp.accounts = [{ brand: 'Add new payment method', last4: 'new' }];
          $scope.payments.forEach(function (acc) {
            for (var pm in pp.paymentMethods) {
              if (acc.object.startsWith(pp.paymentMethods[pm])) {
                pp.accounts.push(acc)
                break
              };
            }
          });
        });
      }
    }

    $scope.retryTransaction = function (orderId, pp) {
      var params = {
        version: pp.version || 'v1',
        orderId: orderId,
        paymentPlanId: pp._id,
        status: 'pending',
        wasProcessed: false
      }

      CommerceService.paymentPlanEdit(params).then(function (res) {
        pp.wasProcessed = "false";
        pp.status = 'pending';
          $rootScope.GlobalAlertSystemAlerts.push({ msg: 'Thank you for resubmitting your payment. It may take a few minutes to retry your transaction and you will be notified via email on the status of the transaction.', type: 'success', dismissOnTimeout: 5000 })
      }).catch(function (err) {
        $rootScope.GlobalAlertSystemAlerts.push({ msg: 'Payment method cannot be updated, please contact us', type: 'danger', dismissOnTimeout: 5000 })
        console.log('ERR: ', err)
      })
    }

    $scope.updateAccount = function (orderId, pp, idx) {
      var objAccount;

      if (pp.last4 === 'new') {
        $rootScope.$emit('openAccountsMenuOrder', pp);
        pp.last4 = '';
        return
      }

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
        wasProcessed: pp.wasProcessed,
        account: pp.account,
        accountBrand: pp.accountBrand,
        last4: pp.last4,
        typeAccount: pp.typeAccount,
        status: pp.status,
      }
      if(pp.status ==="failed"){
        params.status = "pending";
        params.wasProcessed = "false";
      }

      CommerceService.paymentPlanEdit(params).then(function (res) {
        pp.status = "pending";
        pp.wasProcessed = "false";
        $rootScope.GlobalAlertSystemAlerts.push({ msg: 'Payment method was updated successfully', type: 'success', dismissOnTimeout: 5000 })
      }).catch(function (err) {
        $rootScope.GlobalAlertSystemAlerts.push({ msg: 'Payment method cannot be updated, please contact us', type: 'danger', dismissOnTimeout: 5000 })
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
