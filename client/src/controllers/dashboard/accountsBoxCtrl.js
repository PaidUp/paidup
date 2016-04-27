'use strict'

module.exports = [ '$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
  $scope.updateAccounts = function () {
    $rootScope.$emit('openAccountsMenu')
  }
}]
