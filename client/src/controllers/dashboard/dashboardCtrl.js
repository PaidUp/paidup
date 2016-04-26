'use strict'

module.exports = [ '$scope', 'AuthService', '$state', function ($scope, AuthService, $state) {
  $scope.PageOptions.pageClass = 'dashboard-page'
  $scope.user = AuthService.getCurrentUser()
  console.log($scope.user)
  $scope.logout = function () {
    AuthService.logout()
    $state.go('login')
  }
}]
