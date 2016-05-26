'use strict'
var angular = require('angular')
/* global Plaid */

module.exports = [ '$scope', 'UserService', '$timeout', '$rootScope', 'AuthService', 'PaymentService', 'TrackerService', 'SignUpService', 'ApplicationConfigService',
  function ($scope, UserService, $timeout, $rootScope, AuthService, PaymentService, TrackerService, SignUpService, ApplicationConfigService) {
    ApplicationConfigService.getConfig().then(function (config) {
      Stripe.setPublishableKey(config.stripeApiPublic)
    })

  $scope.accounts = []
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

  $scope.init = function(){
    init();
  }

    $scope.getBrandCardClass = function(brand){
      return PaymentService.getBrandCardClass(brand);
    }

  function init(){
    AuthService.getCurrentUserPromise().then(function (user) {
      PaymentService.listCards(user._id).then(function (accounts) {
        $scope.accounts = accounts.data
      }).catch(function (err) {
        console.log('ERR', err)
      })
    }).catch(function (err) {
      console.log('err', err)
    })
  }


  $rootScope.$on('openAccountsMenu', function (event, data) {
    $scope.activeAccountMenu = true
  })

  $rootScope.$on('accountMenuReset', function (event, data) {
    $scope.accounts = [];
    init();
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

  $scope.deleteAccount = function () {
    $scope.accountModalTitle = 'Are you sure you want to delete this Account'
    $scope.deletingAccount = true
  }

  $scope.cancelEditing = function () {
    $scope.editingAccount = false
    if ($scope.isNewCard) {
      $scope.showAccountModal = false
    }
  }

  $scope.selectAccount = function (accountId) {
    $scope.accounts
    angular.forEach($scope.accounts, function (val) {
      val.selected = false
      if (val.id === accountId) {
        val.selected = true
        $rootScope.$emit('loadCardSelected', val);
      }
    })
    $scope.showAccountModal = false
    $scope.activeAccountMenu = false

  }

  $scope.saveAccount = function (form) {
    var f = form
    // To fix autocomplete issues
    f.$commitViewValue()
    $scope.validateCardInfo(f)
    SignUpService.runFormControlsValidation(f)
    if (f.$valid) {
      console.log('VALID')
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

      }, function stripeResponseHandler (status, response) {
        if (response.error) {
          $scope.loading = false
          if (response.error.message) {
            TrackerService.create('Create credit card error', response.error.message)
          } else if (Object.keys(response.error).length !== 0) {
            for (var key in response.error) {
              TrackerService.create('Create credit card error', response.error[key])
            }
          } else {
            TrackerService.create('Create credit card error', 'Hey, you left some fields blank. Please fill them out.')
          }
        } else {
          var token = response.id

          PaymentService.associateCard(token).then(
            function (source) {
              console.log('success')
              TrackerService.create('Create card success', {})
              var promise = SignUpService.createBillingAddress($scope.modalAccount.billingAddress)
              promise.then(function (message) {
                $rootScope.GlobalAlertSystemAlerts.push({msg: 'Credit card was created successful', type: 'success', dismissOnTimeout: 5000})
                $scope.show = false;
                $scope.showAccountModal = false
                $scope.loading = false
                $rootScope.$emit('reloadAccountsBox')

                init();
              }, function (err) {
                console.log('ERROR', err)
                $rootScope.GlobalAlertSystemAlerts.push({msg: 'Credit card can´t be crated', type: 'warning', dismissOnTimeout: 5000})
                $scope.error = err
                $scope.loading = false

              })
            },
            function () {
              $scope.loading = false
              TrackerService.create('Create card error', 'Oops. Invalid card. Please check the number and try again.')
              $rootScope.GlobalAlertSystemAlerts.push({msg: 'Oops. Invalid card. Please check the number and try again.', type: 'warning', dismissOnTimeout: 5000})
              $scope.showAccountModal = false
            })
        }
      })
    } else {
      $rootScope.GlobalAlertSystemAlerts.push({msg: 'All fields are required.', type: 'warning', dismissOnTimeout: 5000})

      console.log('INVALID')
    }
  }

  $scope.validateCardInfo = function (f) {
    console.log('$scope.cardNumber', $scope.modalAccount.cardNumber)
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
/*
  var plaidHandler = Plaid.create({
    env: 'tartan',
    clientName: 'Client Name',
    key: 'test_key',
    product: 'auth',
    onSuccess: function (public_token, metadata) {
      $scope.bank_name = metadata.institution.name
      $scope.showSuccessBankModal = true
      $scope.$apply()
    }
  })

  $scope.openPlaidModal = function () {
    plaidHandler.open()
    $scope.showSelectAccountTypeModal = false
  }
 */

}]
