'use strict'

module.exports = [ '$scope', 'SignUpService', '$state', 'UserService', function ($scope, SignUpService, $state, UserService) {
  $scope.businessTypes = ['Non-Profit', 'LLC', 'Corporation', 'Sole Proprietorship', 'Partnership']
  $scope.loading = false
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.next = function () {
    // Validation start
    $scope.loading = true
    var f = $scope.form
    // To fix autocomplete issues
    f.$commitViewValue()
    SignUpService.runFormControlsValidation(f)
    if (f.$valid) {
      SignUpService.saveBusinessOrganization($scope.user)
      $state.go('^.step4b')
    } else {
      $scope.loading = false
      console.log('INVALID')
    }
  }
}]
