'use strict'

module.exports = [ '$scope', 'SignUpService', '$state', '$rootScope', function ($scope, SignUpService, $state, $rootScope) {
  if(!$rootScope.isCoookieSupported){
    $state.go('login');
    return;
  }

  $scope.userType = ''
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.loading = false;
  $scope.next = function () {
    $scope.loading = true
    if ($scope.userType === '') {
      $scope.error = 'Please select a type'
      $scope.loading = false
      return
    }
    $scope.error = ''
    SignUpService.setType($scope.userType)
    $state.go('^.step1')
  }
}]
