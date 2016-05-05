'use strict'

module.exports = [ '$scope', 'SignUpService', '$state', function ($scope, SignUpService, $state) {
  $scope.loading = false
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.referralCode = ''
  $scope.next = function () {
    $scope.loading = true
    SignUpService.setReferralCode($scope.referralCode)
    $state.go('^.step3b')
    // $state.go('^.welcome')
  }
}]
