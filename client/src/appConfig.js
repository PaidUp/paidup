'use strict'
var englishTranslations = require('./translations/en')
var spanishTranslations = require('./translations/es')

module.exports = ['$stateProvider', '$urlRouterProvider', 'FacebookProvider', '$locationProvider', '$translateProvider', function ($stateProvider, $urlRouterProvider, FacebookProvider, $locationProvider, $translateProvider) {
  // Remove initial Hash in URL
  $locationProvider.html5Mode({
    enabled: true
  })

  // Facebook API key
  FacebookProvider.init('717631811625048')
  // FacebookProvider.init('499580560213861')

  // TRANSLATE MODULE CONFIG
  $translateProvider.translations('en', englishTranslations)

  $translateProvider.translations('es', spanishTranslations)

  $translateProvider.preferredLanguage('en')
  $translateProvider.useSanitizeValueStrategy('sanitize')

  // UI ROUTER
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise('/login')
  //
  // Now set up the states
  $stateProvider
    .state('singup', {
      abstract: true,
      url: '/singup',
      templateUrl: '../templates/singup.html',
      controller: 'SingUpCtrl'
    })
    .state('singup.step0', {
      url: '/step0',
      templateUrl: '../templates/singup.step0.html',
      controller: 'SingUp0Ctrl'
    })
    .state('singup.step1', {
      url: '/step1',
      templateUrl: '../templates/singup.step1.html',
      controller: 'SingUp1Ctrl'
    })
    .state('singup.step2p', {
      url: '/step2p',
      templateUrl: '../templates/singup.step2p.html',
      controller: 'SingUp2pCtrl'
    })
    .state('singup.step3p', {
      url: '/step3p',
      templateUrl: '../templates/singup.step3p.html',
      controller: 'SingUp3pCtrl'
    })
    .state('singup.step2b', {
      url: '/step2b',
      templateUrl: '../templates/singup.step2b.html',
      controller: 'SingUp2bCtrl'
    })
    .state('singup.step3b', {
      url: '/step3b',
      templateUrl: '../templates/singup.step3b.html',
      controller: 'SingUp3bCtrl'
    })
    .state('singup.step4b', {
      url: '/step4b',
      templateUrl: '../templates/singup.step4b.html',
      controller: 'SingUp4bCtrl'
    })
    .state('singup.step5b', {
      url: '/step5b',
      templateUrl: '../templates/singup.step5b.html',
      controller: 'SingUp5bCtrl'
    })
    .state('singup.step6b', {
      url: '/step6b',
      templateUrl: '../templates/singup.step6b.html',
      controller: 'SingUp6bCtrl'
    })
    .state('singup.welcome', {
      url: '/welcome',
      templateUrl: '../templates/singup.welcome.html',
      controller: 'SingUpWelcomeCtrl'
    })
    .state('login', {
      url: '/login',
      templateUrl: '../templates/login.html',
      controller: 'LoginCtrl'
    })
}
]
