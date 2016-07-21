'use strict'

module.exports = [ '$scope', '$rootScope', '$window', '$location', 'SessionService', 'PaymentService', function ($scope, $rootScope, $window, $location, SessionService, PaymentService) {
  $scope.clickAccounts = function () {
    PaymentService.setAllPaymentMethodTrue()
    $rootScope.$emit('openAccountsMenu')
  }
  $scope.clickMobileMenu = function () {
    $rootScope.$emit('openMobileMenu')
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
