'use strict'
/* global Stripe */

module.exports = [ '$scope', 'ApplicationConfigService', 'UserService', 'SignUpService', '$state', 'TrackerService', 'PaymentService', function ($scope, ApplicationConfigService, UserService, SignUpService, $state, TrackerService, PaymentService) {
  ApplicationConfigService.getConfig().then(function (config) {
    Stripe.setPublishableKey(config.stripeApiPublic)
  })

  $scope.billingAddress = {}

  $scope.states = UserService.getStates()
  $scope.loading = false
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.linkCard = function () {
    var f = $scope.form
    // To fix autocomplete issues
    f.$commitViewValue()
    $scope.validateCardInfo(f)
    SignUpService.runFormControlsValidation(f)
    if (f.$valid) {
      console.log('VALID')
      $scope.loading = true
      Stripe.card.createToken({
        name: $scope.nameOnCard,
        number: $scope.cardNumber,
        cvc: $scope.secCode,
        exp: $scope.expDate,
        address_city: $scope.billingAddress.city,
        address_line1: $scope.billingAddress.streetAddress,
        address_state: $scope.billingAddress.state,
        address_zip: $scope.billingAddress.zipCode
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
              var promise = SignUpService.createBillingAddress($scope.billingAddress)
              promise.then(function (message) {
                $state.go('^.welcome')
              }, function (err) {
                console.log('ERROR', err)
                $scope.error = err
                $scope.loading = false
              })
            },
            function () {
              $scope.loading = false
              TrackerService.create('Create card error', 'Oops. Invalid card. Please check the number and try again.')
            })
        }
      })
    } else {
      console.log('INVALID')
    }
  }

  $scope.validateCardInfo = function (f) {
    if (Stripe.card.validateCardNumber($scope.cardNumber)) {
      f.cNum.$setValidity('cNum', true)
    } else {
      f.cNum.$setValidity('cNum', false)
    }
    if (Stripe.card.validateExpiry($scope.expDate)) {
      f.cExpDate.$setValidity('cExpDate', true)
    } else {
      f.cExpDate.$setValidity('cExpDate', false)
    }
  }
}]
