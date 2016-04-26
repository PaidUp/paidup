'use strict'

module.exports = ['$rootScope', 'AuthService', '$state', function ($rootScope, AuthService, $state) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams) {
    var requireLogin = toState.data.requireLogin

    if (requireLogin && !AuthService.isLoggedIn()) {
      event.preventDefault()
      $state.go('login')
    }
  })
}
]
