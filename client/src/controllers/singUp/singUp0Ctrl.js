'use strict'

module.exports = [ '$scope', 'SingUpService', '$state', function ($scope, SingUpService, $state) {
  $scope.userType = ''

  $scope.next = function () {
    if ($scope.userType === '') {
      $scope.error = 'Please select a type'
      return
    }
    $scope.error = ''
    SingUpService.setType($scope.userType)
    $state.go('^.step1')
  }
}]
