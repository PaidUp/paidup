'use strict'

module.exports = [ '$scope', 'SignUpService', '$state', function ($scope, SignUpService, $state) {
  $scope.PageOptions.pageClass = 'signup-page'
  if (!$state.is('signup.step0') && !SignUpService.isValidSession()) {
    // $state.go('login')
  }
}]
