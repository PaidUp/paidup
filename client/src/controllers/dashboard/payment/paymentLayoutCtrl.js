'use strict'

module.exports = [ '$scope', '$rootScope', '$state', function ($scope, $rootScope, $state) {

  $rootScope.$on('changePaymentStep', function (event, data) {
    $scope.step = data;
  })


}]
