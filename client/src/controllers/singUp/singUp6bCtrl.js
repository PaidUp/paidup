'use strict'

module.exports = [ '$scope', 'SingUpService', '$state', function ($scope, SingUpService, $state) {
  $scope.loading = false
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.referralCode = ''
  $scope.next = function () {
    $scope.loading = true
    SingUpService.setReferralCode($scope.referralCode)
    $state.go('^.step3b')
    // $state.go('^.welcome')
  }
}]
