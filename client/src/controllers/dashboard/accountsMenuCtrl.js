'use strict'
var angular = require('angular')
/* global Plaid, Stripe */

module.exports = ['$scope', 'UserService', '$timeout', '$rootScope', 'AuthService', 'PaymentService', 'TrackerService', 'SignUpService', 'ApplicationConfigService', '$location',
  function ($scope, UserService, $timeout, $rootScope, AuthService, PaymentService, TrackerService, SignUpService, ApplicationConfigService, $location) {
    ApplicationConfigService.getConfig().then(function (config) {
      Stripe.setPublishableKey(config.stripeApiPublic)
    })

    $scope.accounts = []
    $scope.allAccounts = []
    $scope.loading = false
    $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
    $scope.states = UserService.getStates()
    $scope.modalAccount = {}
    $scope.showAccountModal = false
    $scope.showSelectAccountTypeModal = false
    // $scope.showSuccessBankModal = true
    $scope.bank_name = ''
    $scope.editingAccount = false
    $scope.deletingAccount = false
    $scope.isNewCard = false

    $scope.init = function () {
      init()
    }

    $scope.getBrandCardClass = function (brand) {
      return PaymentService.getBrandCardClass(brand)
    }

    function init() {
      $scope.cardIsVisible = PaymentService.getPaymentMethod('card')
      $scope.bankIsVisible = PaymentService.getPaymentMethod('bank')
      AuthService.getCurrentUserPromise().then(function (user) {
        PaymentService.listAccounts(user._id).then(function (Accounts) {
          $scope.allAccounts = Accounts.data
          $scope.accounts = Accounts.data
        }).catch(function (err) {
          console.log('ERR', err)
        })
      }).catch(function (err) {
        console.log('err', err)
      })
    }

    $rootScope.$on('openAccountsMenu', function (event, data) {
      $scope.cardIsVisible = PaymentService.getPaymentMethod('card')
      $scope.bankIsVisible = PaymentService.getPaymentMethod('bank')
      $scope.activeAccountMenu = true
      $scope.isCheckout = false
      $scope.accounts = $scope.allAccounts
    })
    $rootScope.$on('openAccountsMenuCheckout', function (event, data) {
      $scope.cardIsVisible = PaymentService.getPaymentMethod('card')
      $scope.bankIsVisible = PaymentService.getPaymentMethod('bank')
      $scope.activeAccountMenu = true
      $scope.isCheckout = true
      $scope.accounts = $scope.allAccounts.filter(function (acc) {
        return ($scope.bankIsVisible && acc.object === 'bank_account' || $scope.cardIsVisible && acc.object === 'card')
      })
    })
    $rootScope.$on('openAccountsMenuOrder', function (event, data) {
      $scope.cardIsVisible = data.paymentMethods.indexOf('card') >= 0;
      $scope.bankIsVisible = data.paymentMethods.indexOf('bank') >= 0;
      $scope.activeAccountMenu = true
      $scope.showSelectAccountTypeModal = true
      $scope.isCheckout = false
      $scope.isOrder = true
      $scope.accounts = $scope.allAccounts.filter(function (acc) {
        return ($scope.bankIsVisible && acc.object === 'bank_account' || $scope.cardIsVisible && acc.object === 'card')
      })
    })

    $rootScope.$on('accountMenuReset', function (event, data) {
      $scope.accounts = []
      init()
    })

    $scope.showAccount = function (account) {
      $scope.modalAccount = angular.copy(account)
      $scope.editingAccount = false
      $scope.deletingAccount = false
      $scope.isNewCard = false
      $scope.accountModalTitle = 'Account Details'
      $scope.showAccountModal = true
    }

    $scope.closeModal = function () {
      $scope.showAccountModal = false
    }

    $scope.openSelectAccountType = function () {
      $scope.showSelectAccountTypeModal = true
    }

    $scope.linkNewCard = function () {
      $scope.modalAccount = {}
      $scope.accountModalTitle = 'Link New Account'
      $scope.isNewCard = true
      $scope.editingAccount = true
      $scope.showSelectAccountTypeModal = false
      $scope.showAccountModal = true
    }

    $scope.editAccount = function () {
      $scope.accountModalTitle = 'Edit Account Details'
      $scope.isNewCard = false
      $scope.editingAccount = true
    }

    $scope.cancelEditing = function () {
      $scope.editingAccount = false
      if ($scope.isNewCard) {
        $scope.showAccountModal = false
      }
    }

    $scope.deleteAccount = function (accountId) {
      PaymentService.deleteSource(accountId).then(function(resp){
        console.log(resp);
      })
    }

    $scope.selectAccount = function (accountId) {
      $scope.accounts
      angular.forEach($scope.accounts, function (val) {
        val.selected = false
        if (val.id === accountId) {
          val.selected = true
          $rootScope.$emit('loadCardSelected', val)
        }
      })
      $scope.showAccountModal = false
      $scope.activeAccountMenu = false
      $rootScope.$emit('focusBtnCreateOrder')
    }

    $scope.saveAccount = function (form) {
      var f = form
      // To fix autocomplete issues
      f.$commitViewValue()
      $scope.validateCardInfo(f)
      SignUpService.runFormControlsValidation(f)
      if (f.$valid) {
        $scope.loading = true
        Stripe.card.createToken({
          name: $scope.modalAccount.nameOnCard,
          number: $scope.modalAccount.cardNumber,
          cvc: $scope.modalAccount.secCode,
          exp: $scope.modalAccount.expireDate,
          address_city: $scope.modalAccount.billingAddress.city,
          address_line1: $scope.modalAccount.billingAddress.streetAddress,
          address_state: $scope.modalAccount.billingAddress.state,
          address_zip: $scope.modalAccount.billingAddress.zipCode

        }, function stripeResponseHandler(status, response) {
          if (response.error) {
            $scope.loading = false
          } else {
            var token = response.id

            PaymentService.associateCard(token).then(
              function (source) {
                TrackerService.track('Add Payment Account', { Type: source.object })
                var promise = SignUpService.createBillingAddress($scope.modalAccount.billingAddress)
                promise.then(function (message) {
                  f.$setPristine()
                  f.$setUntouched()
                  $rootScope.GlobalAlertSystemAlerts.push({ msg: 'Card was created successfully', type: 'success', dismissOnTimeout: 5000 })
                  if ($location.path() === '/payment/plan') {
                    $rootScope.GlobalAlertSystemAlerts.push({ msg: 'Please select the account you would like to pay with.', type: 'warning', dismissOnTimeout: 10000 })
                  }
                  if ($location.path() === '/dashboard/orders') {
                    $rootScope.GlobalAlertSystemAlerts.push({ msg: 'Please select the account you would like to pay with.', type: 'warning', dismissOnTimeout: 10000 })
                    $scope.activeAccountMenu = false;
                    $rootScope.$emit('reloadAccountsOrder')
                  }
                  $scope.show = false
                  $scope.showAccountModal = false
                  $scope.loading = false
                  $rootScope.$emit('reloadAccountsBox')

                  init()
                }, function (err) {
                  console.log('ERROR', err)
                  $rootScope.GlobalAlertSystemAlerts.push({ msg: 'Credit card can´t be crated', type: 'warning', dismissOnTimeout: 5000 })
                  $scope.error = err
                  $scope.loading = false
                })
              },
              function () {
                $scope.loading = false
                $rootScope.GlobalAlertSystemAlerts.push({ msg: 'Oops. Invalid card. Please check the number and try again.', type: 'warning', dismissOnTimeout: 5000 })
                $scope.showAccountModal = false
              })
          }
        })
      } else {
        $rootScope.GlobalAlertSystemAlerts.push({ msg: 'All fields are required.', type: 'warning', dismissOnTimeout: 5000 })

        console.log('INVALID')
      }
    }

    $scope.validateCardInfo = function (f) {
      if (Stripe.card.validateCardNumber($scope.modalAccount.cardNumber)) {
        f.cNum.$setValidity('cNum', true)
      } else {
        f.cNum.$setValidity('cNum', false)
      }
      if (Stripe.card.validateExpiry($scope.modalAccount.expireDate)) {
        f.cExpDate.$setValidity('cExpDate', true)
      } else {
        f.cExpDate.$setValidity('cExpDate', false)
      }
    }

    var plaidHandler = function (config) {
      return Plaid.create({
        env: config.plaidEnv,
        clientName: config.plaidClientName,
        key: config.plaidKey,
        product: config.plaidProduct,
        selectAccount: true,
        apiVersion: 'v2',
        onLoad: function () {
          // The Link module finished loading.
          console.log('onLoad...')
        },
        onSuccess: function (publicToken, metadata) {
          PaymentService.plaidServices({ publicToken: publicToken, metadata: metadata }).then(function (data) {
            $scope.bank_name = metadata.institution.name
            $scope.showSuccessBankModal = true

            // $rootScope.GlobalAlertSystemAlerts.push({msg: 'Bank was created successfully', type: 'success', dismissOnTimeout: 5000})
            // $scope.show = false
            // $scope.showSuccessBankModal = false
            // $scope.loading = false
            if ($location.path() === '/dashboard/orders') {
              $rootScope.GlobalAlertSystemAlerts.push({ msg: 'Please select the account you would like to pay with.', type: 'warning', dismissOnTimeout: 10000 })
              $scope.showAccountModal = false
              $rootScope.GlobalAlertSystemAlerts.push({ msg: 'Please select the account you would like to pay with.', type: 'warning', dismissOnTimeout: 10000 })
              $scope.activeAccountMenu = false;
              $rootScope.$emit('reloadAccountsOrder')
            }
            $rootScope.$emit('reloadAccountsBox')
            init()
          }).catch(function (err) {
            console.log('ERR', err)
          })
        },
        onExit: function () {
          // The user exited the Link flow.
          console.log('onExit...')
        }
      })
    }

    $scope.openPlaidModal = function () {
      ApplicationConfigService.getConfig().then(function (config) {
        plaidHandler(config).open()
        $scope.showSelectAccountTypeModal = false
      })
    }
  }]
