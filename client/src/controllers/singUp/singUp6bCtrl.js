'use strict'

module.exports = [ '$scope', 'SingUpService', '$state', function ($scope, SingUpService, $state) {
  $scope.referralCode = ''
  $scope.next = function () {
    SingUpService.setReferralCode($scope.referralCode)
    $state.go('^.welcome')
  }
}]
