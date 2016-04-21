'use strict'

module.exports = [ '$scope', 'SingUpService', '$state', function ($scope, SingUpService, $state) {
  
  $scope.userType = SingUpService.getType()
  $scope.next = function () {
    if ($scope.userType === 'personal') {
      $state.go('^.step2p')
    }
    if ($scope.userType === 'business') {
      $state.go('^.step2b')
    }
  }
}]
