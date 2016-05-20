'use strict'

module.exports = [ '$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
  $scope.clickAccount = function () {
    $rootScope.$emit('openAccountsMenu')
  }




}]
