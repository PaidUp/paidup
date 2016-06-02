'use strict'

module.exports = [ '$scope', '$rootScope', '$state', 'AuthService', function ($scope, $rootScope, $state, AuthService) {
  $rootScope.$on('openMobileMenu', function (event, data) {
    $scope.activeMobileMenu = true
  })

  $scope.clickAccounts = function () {
    $scope.activeMobileMenu = false
    $rootScope.$emit('openAccountsMenu')
  }

  $scope.hideMenu = function () {
    $scope.activeMobileMenu = false
  }

  $scope.logout = function () {
    AuthService.logout()
    $state.go('login')
  }
}]
