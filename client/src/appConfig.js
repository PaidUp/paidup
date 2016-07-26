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
      template: require('../templates/dashboard/dashboard.html'),
      controller: 'DashboardCtrl',
      data: {
        requireLogin: true
      }
    })
    .state('dashboard.summary', {
      abstract: true,
      template: require('../templates/dashboard/dashboard.summary.html')
    })
    .state('dashboard.summary.components', {
      url: '^/dashboard/summary',
      views: {
        'accounts': {
          template: require('../templates/dashboard/dashboard.accounts.box.html'),
          controller: 'AccountsBoxCtrl'
        },
        'nextPayment': {
          template: require('../templates/dashboard/dashboard.next.box.html'),
          controller: 'NextPaymentBoxCtrl'
        },
        'activeOrders': {
          template: require('../templates/dashboard/dashboard.orders.box.html'),
          controller: 'ActiveOrdersBoxCtrl'
        },
        'recentTransactions': {
          template: require('../templates/dashboard/dashboard.recent.box.html'),
          controller: 'RecentBoxCtrl'
        }
      }
    })
    .state('dashboard.payment', {
      url: '/payment',
      abstract: true,
      template: require('../templates/dashboard/payment/payment.layout.html'),
      controller: 'PaymentLayoutCtrl'
    })
    .state('dashboard.payment.findOrg', {
      url: '^/payment/findOrg',
      template: require('../templates/dashboard/payment/find.organization.html'),
      controller: 'FindOrganizationCtrl'
    })
    .state('dashboard.payment.plan', {
      url: '^/payment/plan/:categoryId',
      template: require('../templates/dashboard/payment/payment.plan.html'),
      controller: 'PaymentPlanCtrl'
    })
    .state('dashboard.payment.done', {
      url: '^/payment/thankyou',
      template: require('../templates/dashboard/payment/payment.done.html'),
      controller: 'PaymentDoneCtrl'
    })
    .state('dashboard.activities', {
      url: '/activity',
      template: require('../templates/dashboard/dashboard.activities.html'),
      controller: 'ActivitiesCtrl'
    })
    .state('dashboard.orders', {
      url: '/orders',
      template: require('../templates/dashboard/dashboard.orders.html'),
      controller: 'OrdersCtrl'
    })
    .state('dashboard.board', {
      url: '/board',
      template: require('../templates/dashboard/dashboard.board.html'),
      controller: 'BoardCtrl'
    })
    .state('dashboard.deposits', {
      url: '/deposits',
      template: require('../templates/dashboard/dashboard.deposits.html'),
      controller: 'DepositsCtrl'
    })
    .state('dashboard.aging', {
      url: '/aging',
      template: require('../templates/dashboard/dashboard.aging.html'),
      controller: 'AgingCtrl'
    })
    .state('dashboard.profile', {
      url: '^/profile',
      template: require('../templates/dashboard/dashboard.profile.html'),
      controller: 'ProfileCtrl'
    })
    .state('signup', {
      abstract: true,
      url: '/signup',
      template: require('../templates/signup.html'),
      controller: 'SignUpCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('signup.step0', {
      url: '/step0',
      template: require('../templates/signup.step0.html'),
      controller: 'SignUp0Ctrl'
    })
    .state('signup.step1', {
      url: '/step1',
      template: require('../templates/signup.step1.html'),
      controller: 'SignUp1Ctrl'
    })
    .state('signup.step2', {
      url: '/step2',
      template: require('../templates/signup.step2.html'),
      controller: 'SignUp2Ctrl'
    })
    .state('signup.step3p', {
      url: '/step3p',
      template: require('../templates/signup.step3p.html'),
      controller: 'SignUp3pCtrl'
    })
    .state('signup.step3b', {
      url: '/step3b',
      template: require('../templates/signup.step3b.html'),
      controller: 'SignUp3bCtrl'
    })
    .state('signup.step4b', {
      url: '/step4b',
      template: require('../templates/signup.step4b.html'),
      controller: 'SignUp4bCtrl'
    })
    .state('signup.step5b', {
      url: '/step5b',
      template: require('../templates/signup.step5b.html'),
      controller: 'SignUp5bCtrl'
    })
    .state('signup.step6b', {
      url: '/step6b',
      template: require('../templates/signup.step6b.html'),
      controller: 'SignUp6bCtrl'
    })
    .state('signup.welcome', {
      url: '/welcome',
      template: require('../templates/signup.welcome.html'),
      controller: 'SignUpWelcomeCtrl'
    })
    .state('productOrganizationResponse', {
      url: '/product/organization/response/:id',
      template: require('../templates/product/organization.response.html'),
      controller: 'OrgResponseCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('commerceProviderResponse', {
      url: '/commerce/provider/response/:id',
      template: require('../templates/product/organization.response.html'),
      controller: 'ProviderResponseCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('login', {
      url: '/login',
      template: require('../templates/login.html'),
      controller: 'LoginCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('category', {
      url: '/cat/:category',
      template: require('../templates/login.html'),
      controller: 'CustomLinkCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('product', {
      url: '/cat/:category/prod/:product',
      template: require('../templates/login.html'),
      controller: 'CustomLinkCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('product-pp', {
      url: '/cat/:category/prod/:product/pp/:paymentPlan',
      template: require('../templates/login.html'),
      controller: 'CustomLinkCtrl',
      data: {
        requireLogin: false
      }
    })
    .state('clean', {
      url: '/clean',
      template: require('../templates/login.html'),
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
