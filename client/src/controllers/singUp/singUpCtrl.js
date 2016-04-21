'use strict'

module.exports = [ '$scope', 'SingUpService', '$state', function ($scope, SingUpService, $state) {
  $scope.PageOptions.pageClass = 'signup-page'
  $scope.PageOptions.showHeader = false
  $scope.PageOptions.showFooter = true
  if (!$state.is('singup.step0') && !SingUpService.isValidSession()) {
    // $state.go('singup.step0')
  }
}]
