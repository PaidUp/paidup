'use strict'

module.exports = [ '$scope', 'AuthService', '$state', function ($scope, AuthService, $state) {
  $scope.PageOptions.pageClass = 'dashboard-page'

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
