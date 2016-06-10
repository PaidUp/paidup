'use strict'

module.exports = [ '$scope', 'SignUpService', '$state', 'TrackerService', function ($scope, SignUpService, $state, TrackerService) {
  $scope.PageOptions.pageClass = 'signup-page'
  if (!$state.is('signup.step0') && !SignUpService.isValidSession()) {
    $state.go('login')
  }

  $scope.init = function (){
    TrackerService.track('Page Viewed');
  }
}]
