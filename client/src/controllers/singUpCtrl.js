'use strict'

module.exports = [ '$scope', 'LoginService', function ($scope, LoginService) {
  $scope.greet = LoginService.greet()
  $scope.PageOptions.pageClass = 'signup-page'
  $scope.PageOptions.showHeader = true
  $scope.PageOptions.showFooter = true
}]
