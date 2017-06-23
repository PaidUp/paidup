'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'SessionService', 'ProductService', function ($scope, AuthService, $state, SessionService, ProductService) {
  $scope.PageOptions.pageClass = 'dashboard-page'

  //$scope.isReferring = SessionService.getReferringDomain() ? true : false;
  $scope.refDomain = SessionService.getReferringDomain();
  $scope.refLogo = SessionService.getReferringLogo();

  AuthService.getCurrentUserPromise().then(function (u) {
    $scope.user = u
    $scope.isCoach = AuthService.isCoach();
    $scope.isAdmin = AuthService.isAdmin();
    $scope.isReferring = u.meta.referrer && u.meta.referrer.length > 0;
  }, function (e) {
    console.log(e)
  })

  $scope.logout = function () {
    AuthService.logout()
    $state.go('login')
  }

  ProductService.cleanPnProducts();
}]
