'use strict'

module.exports = [ '$scope', 'SignUpService', '$state', 'UserService', function ($scope, SignUpService, $state, UserService) {
  $scope.loading = false
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.payFee = function () {
    $scope.loading = true
    // Validation start
    var f = $scope.form
    // To fix autocomplete issues
    f.$commitViewValue()
    SignUpService.runFormControlsValidation(f)
    if (f.$valid) {
      $state.go('^.welcome')
    } else {
      $scope.loading = false
      console.log('INVALID')
    }
  }
}]
