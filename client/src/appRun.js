'use strict'

module.exports = ['$rootScope', 'AuthService', '$state', '$timeout', 'localStorageService', '$stateParams', 'ProductService',
  function ($rootScope, AuthService, $state, $timeout, localStorageService, $stateParams, ProductService) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin

    if (requireLogin && !AuthService.isLoggedIn()) {
      event.preventDefault()
      $state.go('login')
    }
  })
  $rootScope.$on('$stateChangeSuccess', function () {
    $timeout(function () {
      window.scrollTo(0, 0)
    }, 100)
  })
  $rootScope.GlobalAlertSystemAlerts = []
  $rootScope.GlobalAlertSystemClose = function (index) {
    $rootScope.GlobalAlertSystemAlerts.splice(index, 1)
  }

  if(!localStorageService.cookie.isSupported) {
    $rootScope.GlobalAlertSystemAlerts.push({msg: 'For using our services, you should enable cookies.', type: 'danger'})
    $rootScope.isCoookieSupported = false;
  } else {
    $rootScope.isCoookieSupported = true;
  }

    if($stateParams.team){
      var pnProds = ProductService.getPnProducts();
      if(pnProds === null && typeof pnProds !== 'object'){
        pnProds = {};
      }
      pn[$stateParams.team] = {
        paymentPlan : $stateParams.paymentPlan
      }

      ProductService.setPnProducts(pnProds);
    }

  // This is how to set alerts programatically uncmoment to test
  // $rootScope.GlobalAlertSystemAlerts.push({msg: 'Wont close', type: 'info'})
  // $rootScope.GlobalAlertSystemAlerts.push({msg: '2 second timeout', type: 'danger', dismissOnTimeout: 2000})
}
]
