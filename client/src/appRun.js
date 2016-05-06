'use strict'

module.exports = ['$rootScope', 'AuthService', '$state', '$timeout', function ($rootScope, AuthService, $state, $timeout) {
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
}
]
