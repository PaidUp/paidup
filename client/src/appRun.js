'use strict'

module.exports = ['$rootScope', 'AuthService', '$state', '$timeout', 'localStorageService', '$location', 'SessionService', '$window',
  function ($rootScope, AuthService, $state, $timeout, localStorageService, $location, SessionService, $window) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
      var requireLogin = toState.data.requireLogin

      if (requireLogin && !AuthService.isLoggedIn()) {
        if(angular.isDefined(zE.isLoggedIn)){
          zE.isLoggedIn = false;
        }
        event.preventDefault()
        SessionService.setPathAfterLogin($location.path());
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

    if (!localStorageService.cookie.isSupported) {
      $rootScope.GlobalAlertSystemAlerts.push({
        msg: 'For using our services, you should enable cookies.',
        type: 'danger'
      })
      $rootScope.isCoookieSupported = false;
    } else {
      $rootScope.isCoookieSupported = true;
    }

    $rootScope.checkZD = function() {
      var zd = setInterval(function () {
        if (angular.isDefined(zE.identify)) {
          if (angular.isDefined($rootScope.currentUser)) {
            $window.zE.identify({
              name: $rootScope.currentUser.firstName + ' ' + $rootScope.currentUser.lastName, // TODO: Replace with current user's name
              email: $rootScope.currentUser.email // TODO: Replace with current user's email address
            });
            $window.zE.activateIpm();
          }
          clearInterval(zd);
        }
      }, 3000);

    }
    
    $rootScope.checkZD();

    angular.element(document.querySelector("#alerts-container")).removeClass("alerts-container-noscript");

    //$rootScope.$on('$viewContentLoaded', function() {
    //  $templateCache.removeAll();
    //});

    // This is how to set alerts programatically uncmoment to test
    // $rootScope.GlobalAlertSystemAlerts.push({msg: 'Wont close', type: 'info'})
    // $rootScope.GlobalAlertSystemAlerts.push({msg: '2 second timeout', type: 'danger', dismissOnTimeout: 2000})
  }
]
