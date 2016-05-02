'use strict'

module.exports = [ '$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
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
}]
