'use strict'

module.exports = [ '$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {
  $rootScope.$on('openAccountsMenu', function (event, data) {
    $scope.activeAccountMenu = true
  })
}]
