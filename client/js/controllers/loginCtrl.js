'use strict'

module.exports = [ '$scope', 'LoginService', function ($scope, LoginService) {
  $scope.greet = LoginService.greet()
}]
