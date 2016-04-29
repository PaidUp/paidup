'use strict'
var englishTranslations = require('./translations/en')
var spanishTranslations = require('./translations/es')

module.exports = ['$stateProvider', '$urlRouterProvider', 'FacebookProvider', '$locationProvider', '$translateProvider', '$httpProvider', 'uiMask.ConfigProvider', function ($stateProvider, $urlRouterProvider, FacebookProvider, $locationProvider, $translateProvider, $httpProvider, uiMaskConfigProvider) {
  // UI MAsk
  uiMaskConfigProvider.clearOnBlur(false)

  // Remove initial Hash in URL
  $locationProvider.html5Mode({
    enabled: true
  })

  // Facebook API key
  FacebookProvider.init('717631811625048')
  // FacebookProvider.init('499580560213861')

  // HTTP INTERCEPTORS
  $httpProvider.interceptors.push('AuthInterceptor')

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
  .state('dashboard', {
    abstract: true,
    url: '/dashboard',
    templateUrl: '../templates/dashboard/dashboard.html',
    controller: 'DashboardCtrl',
    data: {
      requireLogin: true
    }
  })
  .state('dashboard.summary', {
    abstract: true,
    templateUrl: '../templates/dashboard/dashboard.summary.html'
  })
  .state('dashboard.summary.components', {
    url: '^/dashboard/summary',
    views: {
      'accounts': {
        templateUrl: '../templates/dashboard/dashboard.accounts.box.html',
        controller: 'AccountsBoxCtrl'
      },
      'nextPayment': {
        templateUrl: '../templates/dashboard/dashboard.next.box.html',
        controller: 'NextPaymentBoxCtrl'
      },
      'activeOrders': {
        templateUrl: '../templates/dashboard/dashboard.orders.box.html',
        controller: 'ActiveOrdersBoxCtrl'
      },
      'recentTransactions': {
        templateUrl: '../templates/dashboard/dashboard.recent.box.html',
        controller: 'RecentBoxCtrl'
      }
    }
  })
  .state('dashboard.payment', {
    url: '/payment',
    abstract: true,
    templateUrl: '../templates/dashboard/payment/payment.layout.html',
    controller: 'PaymentLayoutCtrl'
  })
  .state('dashboard.payment.findOrg', {
    url: '^/payment/findOrg',
    templateUrl: '../templates/dashboard/payment/find.organization.html',
    controller: 'FindOrganizationCtrl'
  })
  .state('dashboard.payment.plan', {
    url: '^/payment/plan',
    templateUrl: '../templates/dashboard/payment/payment.plan.html',
    controller: 'PaymentPlanCtrl'
  })
  .state('dashboard.payment.done', {
    url: '^/payment/thankyou',
    templateUrl: '../templates/dashboard/payment/payment.done.html',
    controller: 'PaymentDoneCtrl'
  })
  .state('singup', {
    abstract: true,
    url: '/singup',
    templateUrl: '../templates/singup.html',
    controller: 'SingUpCtrl',
    data: {
      requireLogin: false
    }
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
    controller: 'LoginCtrl',
    data: {
      requireLogin: false
    }
  })
}
]
