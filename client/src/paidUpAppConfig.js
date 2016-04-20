'use strict'

module.exports = function ($stateProvider, $urlRouterProvider, FacebookProvider, $locationProvider) {
  // Remove initial Hash in URL
  $locationProvider.html5Mode({
    enabled: true
  })
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
      abstract: true,
      url: '/singup',
      templateUrl: '../templates/singup.html'
    })
    .state('singup.step1', {
      url: '/step1',
      templateUrl: '../templates/singup.step1.html',
      controller: 'SingUp1Ctrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: '../templates/login.html',
      controller: 'LoginCtrl'
    })
}
