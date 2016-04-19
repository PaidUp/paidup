'use strict'

module.exports = function ($stateProvider, $urlRouterProvider, FacebookProvider) {
  //
  // Facebook API key
  FacebookProvider.init('717631811625048')
  // FacebookProvider.init('499580560213861')
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise('/login')
  //
  // Now set up the states
  $stateProvider
    .state('singup', {
      url: '/singup',
      templateUrl: '../templates/singup_1.html',
      controller: 'SingUpCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: '../templates/login.html',
      controller: 'LoginCtrl'
    })
}
