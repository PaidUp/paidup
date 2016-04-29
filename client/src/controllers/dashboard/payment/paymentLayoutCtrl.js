'use strict'

module.exports = [ '$scope', '$rootScope', '$state', 'SetupPaymentService', function ($scope, $rootScope, $state, SetupPaymentService) {
  $scope.state = SetupPaymentService.getString()
}]
