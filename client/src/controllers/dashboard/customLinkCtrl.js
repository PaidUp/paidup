'use strict'

module.exports = ['$scope', '$state', '$rootScope', '$stateParams', 'ProductService', 'SessionService', 'UserService', '$location',
  function ($scope, $state, $rootScope, $stateParams, ProductService, SessionService, UserService, $location) {
    // Initialization

    function managePnProducts(dest) {
      var pnProds = {}

      if ($stateParams.category) {
        if (!pnProds[$stateParams.category]) {
          pnProds[$stateParams.category] = {};
        }

        if ($stateParams.product) {
          pnProds[$stateParams.category][$stateParams.product] = {}
        }

        if ($stateParams.paymentPlan) {
          pnProds[$stateParams.category][$stateParams.product].pp = $stateParams.paymentPlan || ''
        }
        ProductService.setPnProducts(pnProds);
      } else {
        ProductService.removePnProducts();
      }

      $location.path(dest)
      $location.replace();
    };

    if ($rootScope.isCoookieSupported) {
      if($stateParams.domain){
        SessionService.setReferringDomain($stateParams.domain);
      }

      if($stateParams.image){
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
