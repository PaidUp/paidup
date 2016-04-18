'use strict'

module.exports = [ '$scope', 'LoginService', function ($scope, LoginService) {
  $scope.greet = LoginService.greet()
  console.log('inLogin')
  $scope.PageOptions.pageClass = 'loginpage'
  $scope.PageOptions.showHeader = false
  $scope.PageOptions.showFooter = true
}]
