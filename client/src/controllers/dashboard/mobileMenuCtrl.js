'use strict'

module.exports = [ '$scope', '$rootScope', '$state', 'AuthService', 'PaymentService', function ($scope, $rootScope, $state, AuthService, PaymentService) {
  $rootScope.$on('openMobileMenu', function (event, data) {
    $scope.activeMobileMenu = true
  })

  $scope.clickAccounts = function () {
    PaymentService.setAllPaymentMethodTrue()
    $scope.activeMobileMenu = false
    $rootScope.$emit('openAccountsMenu')
  }

  $scope.hideMenu = function () {
    $scope.activeMobileMenu = false
  }

  $scope.logout = function () {
    AuthService.logout()
    $state.go('login')
  }
}]
