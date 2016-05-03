'use strict'

module.exports = [ '$scope', 'SingUpService', '$state', function ($scope, SingUpService, $state) {
  $scope.userType = ''
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.loading = false
  $scope.next = function () {
    $scope.loading = true
    if ($scope.userType === '') {
      $scope.error = 'Please select a type'
      $scope.loading = false
      return
    }
    $scope.error = ''
    SingUpService.setType($scope.userType)
    $state.go('^.step1')
  }
}]
