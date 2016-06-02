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

        } else {
          var token = response.id

          PaymentService.associateCard(token).then(
            function (source) {
              var promise = SignUpService.createBillingAddress($scope.billingAddress)
              promise.then(function (message) {
                TrackerService.track("Add Payment Account On Sign Up");
                $state.go('^.welcome')
              }, function (err) {
                console.log('ERROR', err)
                $scope.error = err
                $scope.loading = false
              })
            },
            function () {
              $scope.loading = false
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
