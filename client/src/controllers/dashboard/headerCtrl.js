'use strict'

module.exports = [ '$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
  $scope.clickAccounts = function () {
    $rootScope.$emit('openAccountsMenu')
  }
  $scope.clickMobileMenu = function () {
    $rootScope.$emit('openMobileMenu')
  }
}]
