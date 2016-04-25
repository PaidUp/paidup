'use strict'

module.exports = [ '$scope', 'SingUpService', '$state', 'UserService', function ($scope, SingUpService, $state, UserService) {
  $scope.businessTypes = ['Non-Profit', 'LLC', 'Corporation', 'Sole Proprietorship', 'Partnership']
  $scope.next = function () {
    // Validation start
    var f = $scope.form
    SingUpService.runFormControlsValidation(f)
    if (f.$valid) {
      console.log('VALID')
      console.log(SingUpService.saveBusinessOrganization($scope.user))
      $state.go('^.step4b')
    } else {
      console.log('INVALID')
    }
  }
}]
