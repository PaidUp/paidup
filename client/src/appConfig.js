'use strict'
var englishTranslations = require('./translations/en')
var spanishTranslations = require('./translations/es')

module.exports = ['$stateProvider', '$urlRouterProvider', 'FacebookProvider', '$locationProvider', '$translateProvider', '$httpProvider', 'uiMask.ConfigProvider', '$provide', 'localStorageServiceProvider', '$analyticsProvider', 'bugsnagProvider',
  function ($stateProvider, $urlRouterProvider, FacebookProvider, $locationProvider, $translateProvider, $httpProvider, uiMaskConfigProvider, $provide, localStorageServiceProvider, $analyticsProvider, bugsnagProvider) {
  // UI MAsk
  uiMaskConfigProvider.clearOnBlur(false)
  uiMaskConfigProvider.maskDefinitions({'D': /^[0-9]*$/})

  // Remove initial Hash in URL
  $locationProvider.html5Mode({
    enabled: true
  })

  bugsnagProvider
  .noConflict()
  .apiKey('d68afbc3bf2925bd7fa75c7337ea9a29')
  //.releaseStage('development')
  .appVersion('0.1.0');

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
      templateUrl: require('../templates/dashboard/dashboard.html'),
      controller: 'DashboardCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('dashboard.summary', {
      abstract: true,
      controller: 'CustomerBoardCtrl',
      templateUrl: require('../templates/dashboard/dashboard.summary.html')
    })
    .state('dashboard.summary.components', {
      url: '^/dashboard/summary',
      views: {
        'accounts': {
          templateUrl: require('../templates/dashboard/dashboard.accounts.box.html'),
          controller: 'AccountsBoxCtrl'
        },
        'nextPayment': {
          templateUrl: require('../templates/dashboard/dashboard.next.box.html'),
          controller: 'NextPaymentBoxCtrl'
        },
        'activeOrders': {
          templateUrl: require('../templates/dashboard/dashboard.orders.box.html'),
          controller: 'ActiveOrdersBoxCtrl'
        },
        'recentTransactions': {
          templateUrl: require('../templates/dashboard/dashboard.recent.box.html'),
          controller: 'RecentBoxCtrl'
        }
      }
    })
    .state('dashboard.payment', {
      url: '/payment',
      abstract: true,
      templateUrl: require('../templates/dashboard/payment/payment.layout.html'),
      controller: 'PaymentLayoutCtrl'
    })
    .state('dashboard.payment.findOrg', {
      url: '^/payment/findOrg',
      templateUrl: require('../templates/dashboard/payment/find.organization.html'),
      controller: 'FindOrganizationCtrl'
    })
    .state('dashboard.payment.plan', {
      url: '^/payment/plan/:categoryId',
      templateUrl: require('../templates/dashboard/payment/payment.plan.html'),
      controller: 'PaymentPlanCtrl'
    })
    .state('dashboard.payment.done', {
      url: '^/payment/thankyou',
      templateUrl: require('../templates/dashboard/payment/payment.done.html'),
      controller: 'PaymentDoneCtrl'
    })
    .state('dashboard.activities', {
      url: '/activity',
      templateUrl: require('../templates/dashboard/dashboard.activities.html'),
      controller: 'ActivitiesCtrl'
    })
    .state('dashboard.orders', {
      url: '/orders',
      templateUrl: require('../templates/dashboard/dashboard.orders.html'),
      controller: 'OrdersCtrl'
    })
    .state('dashboard.order', {
      url: '/order/:orderId',
      templateUrl: require('../templates/dashboard/dashboard.orders.html'),
      controller: 'OrdersCtrl'
    })
    .state('dashboard.board', {
      url: '/board',
      templateUrl: require('../templates/dashboard/dashboard.board.html'),
      controller: 'BoardCtrl'
    })
    .state('dashboard.deposits', {
      url: '/deposits',
      templateUrl: require('../templates/dashboard/dashboard.deposits.html'),
      controller: 'DepositsCtrl'
    })
    .state('dashboard.aging', {
      url: '/aging',
      templateUrl: require('../templates/dashboard/dashboard.aging.html'),
      controller: 'AgingCtrl'
    })
    .state('dashboard.profile', {
      url: '^/profile',
      templateUrl: require('../templates/dashboard/dashboard.profile.html'),
      controller: 'ProfileCtrl'
    })
    .state('signup', {
      abstract: true,
      url: '/signup',
      templateUrl: require('../templates/signup.html'),
      controller: 'SignUpCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('signup.step0', {
      url: '/step0',
      templateUrl: require('../templates/signup.step0.html'),
      controller: 'SignUp0Ctrl'
    })
    .state('signup.step1', {
      url: '/step1',
      templateUrl: require('../templates/signup.step1.html'),
      controller: 'SignUp1Ctrl'
    })
    .state('signup.step2', {
      url: '/step2',
      templateUrl: require('../templates/signup.step2.html'),
      controller: 'SignUp2Ctrl'
    })
    .state('signup.step3p', {
      url: '/step3p',
      templateUrl: require('../templates/signup.step3p.html'),
      controller: 'SignUp3pCtrl'
    })
    .state('signup.step3b', {
      url: '/step3b',
      templateUrl: require('../templates/signup.step3b.html'),
      controller: 'SignUp3bCtrl'
    })
    .state('signup.step4b', {
      url: '/step4b',
      templateUrl: require('../templates/signup.step4b.html'),
      controller: 'SignUp4bCtrl'
    })
    .state('signup.step5b', {
      url: '/step5b',
      templateUrl: require('../templates/signup.step5b.html'),
      controller: 'SignUp5bCtrl'
    })
    .state('signup.step6b', {
      url: '/step6b',
      templateUrl: require('../templates/signup.step6b.html'),
      controller: 'SignUp6bCtrl'
    })
    .state('signup.welcome', {
      url: '/welcome',
      templateUrl: require('../templates/signup.welcome.html'),
      controller: 'SignUpWelcomeCtrl'
    })
    .state('productOrganizationResponse', {
      url: '/product/organization/response/:id',
      templateUrl: require('../templates/product/organization.response.html'),
      controller: 'OrgResponseCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('commerceProviderResponse', {
      url: '/commerce/provider/response/:id',
      templateUrl: require('../templates/product/organization.response.html'),
      controller: 'ProviderResponseCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: require('../templates/login.html'),
      controller: 'LoginCtrl',
      data: {
        requireLogin: false
      }
    })
    
    .state('category', {
      url: '/cat/:category',
      controller: 'CustomLinkCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('product', {
      url: '/cat/:category/prod/:product',
      templateUrl: require('../templates/login.html'),
      controller: 'CustomLinkCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('product-pp', {
      url: '/cat/:category/prod/:product/pp/:paymentPlan',
      templateUrl: require('../templates/login.html'),
      controller: 'CustomLinkCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('clean', {
      url: '/clean',
      templateUrl: require('../templates/login.html'),
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
    }).state('referring', {
      url: '/token/:token/cat/:category/referring/*domain/logo/*image',
      controller: 'CustomLinkCtrl',
      data: {
        requireLogin: false
      }
    })
}
]
