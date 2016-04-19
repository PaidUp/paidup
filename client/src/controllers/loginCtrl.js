'use strict'

module.exports = [ '$scope', 'AuthService', function ($scope, AuthService) {
  $scope.greet = AuthService.getS()
  $scope.PageOptions.pageClass = 'loginpage'
  $scope.PageOptions.showHeader = false
  $scope.PageOptions.showFooter = true
  $scope.loginInfo = {}

  $scope.normalLogin = function () {
    console.log('login', $scope.loginInfo)
  }

  $scope.facebookLogin = function () {
    console.log('login', $scope.loginInfo)
  }
}]
