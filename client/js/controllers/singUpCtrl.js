'use strict'

module.exports = [ '$scope', 'LoginService', function ($scope, LoginService) {
  $scope.greet = LoginService.greet()
  console.log('insingup')
  $scope.PageOptions.pageClass = 'signUp_page'
  $scope.PageOptions.showHeader = true
  $scope.PageOptions.showFooter = false
}]
