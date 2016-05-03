'use strict'

module.exports = [ '$scope', 'SingUpService', '$state', 'UserService', function ($scope, SingUpService, $state, UserService) {
  $scope.businessTypes = ['Non-Profit', 'LLC', 'Corporation', 'Sole Proprietorship', 'Partnership']
  $scope.loading = false
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.next = function () {
    // Validation start
    $scope.loading = true
    var f = $scope.form
    SingUpService.runFormControlsValidation(f)
    if (f.$valid) {
      console.log('VALID')
      SingUpService.saveBusinessOrganization($scope.user)
      $state.go('^.step4b')
    } else {
      $scope.loading = false
      console.log('INVALID')
    }
  }
}]
