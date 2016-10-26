'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'SessionService', function ($scope, AuthService, $state, SessionService) {
  $scope.PageOptions.pageClass = 'dashboard-page'

  $scope.isReferring = SessionService.getReferringDomain() ? true : false;
  $scope.refDomain = SessionService.getReferringDomain();
  $scope.refLogo = SessionService.getReferringLogo();

  AuthService.getCurrentUserPromise().then(function (u) {
    $scope.user = u
    $scope.isCoach = AuthService.isCoach()
    $scope.isAdmin = AuthService.isAdmin();
  }, function (e) {
    console.log(e)
  })

  $scope.logout = function () {
    AuthService.logout()
    $state.go('login')
  }
}]
