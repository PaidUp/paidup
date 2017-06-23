'use strict'

module.exports = ['$scope', '$state', '$rootScope', '$stateParams', 'ProductService', 'SessionService', 'UserService', '$location',
  function ($scope, $state, $rootScope, $stateParams, ProductService, SessionService, UserService, $location) {
    // Initialization

    function managePnProducts(dest) {
      if ($stateParams.category) {
        var pnProds = {
          category: $stateParams.category,
          product: $stateParams.product || '',
          paymentPlan: $stateParams.paymentPlan || ''
        }
        ProductService.setPnProducts(pnProds);
      } else {
        ProductService.setCleanPnProducts();
      }
      $location.path(dest)
      $location.replace();
    };

    if ($rootScope.isCoookieSupported) {
      if ($stateParams.domain) {
        SessionService.setReferringDomain($stateParams.domain);
      }

      if ($stateParams.image) {
        SessionService.setReferringLogo($stateParams.image)
      }

      if ($stateParams.token) {
        SessionService.addSession({ token: $stateParams.token });
        UserService.get($stateParams.token, function (user) {
          $rootScope.currentUser = user;
          managePnProducts('/payment/findOrg');
        });

      } else {
        managePnProducts('login');
      }
    }
  }]