'use strict'
var englishTranslations = require('./translations/en')
var spanishTranslations = require('./translations/es')

module.exports = ['$stateProvider', '$urlRouterProvider', 'FacebookProvider', '$locationProvider', '$translateProvider', '$httpProvider', 'uiMask.ConfigProvider', '$provide', 'localStorageServiceProvider', '$analyticsProvider',
  function ($stateProvider, $urlRouterProvider, FacebookProvider, $locationProvider, $translateProvider, $httpProvider, uiMaskConfigProvider, $provide, localStorageServiceProvider, $analyticsProvider) {
  // UI MAsk
  uiMaskConfigProvider.clearOnBlur(false)
  uiMaskConfigProvider.maskDefinitions({'D': /^[0-9]*$/})

  // Remove initial Hash in URL
  $locationProvider.html5Mode({
    enabled: true
  })

    $analyticsProvider.virtualPageviews(false);

  localStorageServiceProvider
      .setPrefix('PaidUp')
      .setStorageType('sessionStorage')
      .setNotify(true, true)

  // Facebook API key
  // FacebookProvider.init('717631811625048')
  FacebookProvider.init('499580560213861')

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
    .state('dashboard.activities', {
      url: '/activity',
      templateUrl: '../templates/dashboard/dashboard.activities.html',
      controller: 'ActivitiesCtrl'
    })
    .state('dashboard.orders', {
      url: '/orders',
      templateUrl: '../templates/dashboard/dashboard.orders.html',
      controller: 'OrdersCtrl'
    })
    .state('dashboard.board', {
      url: '/board',
      templateUrl: '../templates/dashboard/dashboard.board.html',
      controller: 'BoardCtrl'
    })
    .state('dashboard.deposits', {
      url: '/deposits',
      templateUrl: '../templates/dashboard/dashboard.deposits.html',
      controller: 'DepositsCtrl'
    })
    .state('dashboard.aging', {
      url: '/aging',
      templateUrl: '../templates/dashboard/dashboard.aging.html',
      controller: 'AgingCtrl'
    })
    .state('dashboard.profile', {
      url: '^/profile',
      templateUrl: '../templates/dashboard/dashboard.profile.html',
      controller: 'ProfileCtrl'
    })
    .state('signup', {
      abstract: true,
      url: '/signup',
      templateUrl: '../templates/signup.html',
      controller: 'SignUpCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('signup.step0', {
      url: '/step0',
      templateUrl: '../templates/signup.step0.html',
      controller: 'SignUp0Ctrl'
    })
    .state('signup.step1', {
      url: '/step1',
      templateUrl: '../templates/signup.step1.html',
      controller: 'SignUp1Ctrl'
    })
    .state('signup.step2', {
      url: '/step2',
      templateUrl: '../templates/signup.step2.html',
      controller: 'SignUp2Ctrl'
    })
    .state('signup.step3p', {
      url: '/step3p',
      templateUrl: '../templates/signup.step3p.html',
      controller: 'SignUp3pCtrl'
    })
    .state('signup.step3b', {
      url: '/step3b',
      templateUrl: '../templates/signup.step3b.html',
      controller: 'SignUp3bCtrl'
    })
    .state('signup.step4b', {
      url: '/step4b',
      templateUrl: '../templates/signup.step4b.html',
      controller: 'SignUp4bCtrl'
    })
    .state('signup.step5b', {
      url: '/step5b',
      templateUrl: '../templates/signup.step5b.html',
      controller: 'SignUp5bCtrl'
    })
    .state('signup.step6b', {
      url: '/step6b',
      templateUrl: '../templates/signup.step6b.html',
      controller: 'SignUp6bCtrl'
    })
    .state('signup.welcome', {
      url: '/welcome',
      templateUrl: '../templates/signup.welcome.html',
      controller: 'SignUpWelcomeCtrl'
    })
    .state('productOrganizationResponse', {
      url: '/product/organization/response/:id',
      templateUrl: '../templates/product/organization.response.html',
      controller: 'OrgResponseCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('commerceProviderResponse', {
      url: '/commerce/provider/response/:id',
      templateUrl: '../templates/product/organization.response.html',
      controller: 'ProviderResponseCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: '../templates/login.html',
      controller: 'LoginCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('category', {
      url: '/cat/:category',
      templateUrl: '../templates/login.html',
      controller: 'CustomLinkCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('product', {
      url: '/cat/:category/prod/:product',
      templateUrl: '../templates/login.html',
      controller: 'CustomLinkCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('product-pp', {
      url: '/cat/:category/prod/:product/pp/:paymentPlan',
      templateUrl: '../templates/login.html',
      controller: 'CustomLinkCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('clean', {
      url: '/clean',
      templateUrl: '../templates/login.html',
      controller: 'CustomLinkCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('auth-password-reset', {
      url: '/auth/password/reset?token',
      // templateUrl: '../templates/login.html',
      controller: 'ResetPasswordCtrl',
      data: {
        requireLogin: false
      }
    })
}
]
