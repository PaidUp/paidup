'use strict'
/* global Stripe */

module.exports = [ '$scope', 'ApplicationConfigService', 'UserService', 'SingUpService', '$state', function ($scope, ApplicationConfigService, UserService, SingUpService, $state) {
  ApplicationConfigService.getConfig().then(function (config) {
    Stripe.setPublishableKey(config.stripeApiPublic)
  })

  $scope.billingAddress = {}

  $scope.states = UserService.getStates()
  $scope.loading = false
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.linkCard = function () {
    var f = $scope.form
    SingUpService.runFormControlsValidation(f)
    if (f.$valid) {
      console.log('VALID')
      $scope.loading = true
      var promise = SingUpService.createBillingAddress($scope.billingAddress)

      promise.then(function (message) {
        console.log(message)
        $state.go('^.welcome')
      }, function (err) {
        console.log('ERROR', err)
        $scope.error = err
        $scope.loading = false
      })
    } else {
      console.log('INVALID')
    }
  }
}]
