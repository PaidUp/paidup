'use strict'

module.exports = [ '$rootScope', '$scope', 'AuthService', '$state', 'SessionService', 'ProductService', function ($rootScope, $scope, AuthService, $state, SessionService, ProductService) {
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
  var permissions = $rootScope.currentUser.permissions;
  $scope.hasPermission = {
    "dashboard.deposits" : permissions["payment/transfer/:destinationId/from/:from/to/:to"]

  }

  $scope.logout = function () {
    AuthService.logout()
    $state.go('login')
  }

  ProductService.cleanPnProducts();
}]
