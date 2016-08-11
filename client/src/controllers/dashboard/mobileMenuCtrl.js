'use strict'

module.exports = [ '$scope', '$rootScope', '$state', 'AuthService', 'PaymentService', 'SessionService', '$window', '$location',
function ($scope, $rootScope, $state, AuthService, PaymentService, SessionService, $window, $location) {
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

  $scope.goAdminSite = function () {
    var host = $location.host();
    var adminUrl = ''
    var token = SessionService.getCurrentSession();

    if(host.indexOf('app') === 0){
      adminUrl = 'https://admin.getpaidup.com/access?token='+token;
    }
    else if(host.indexOf('stg') === 0){
      adminUrl = 'https://admstg.getpaidup.com/access?token='+token;
    }
    else if(host.indexOf('dev') === 0){
      adminUrl = 'https://admdev.getpaidup.com/access?token='+token;
    }
    else {
      adminUrl = 'http://localhost:4000/access?token='+token;
    }
    $window.location.href = adminUrl;

  }
}]
