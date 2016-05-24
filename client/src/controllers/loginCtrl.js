'use strict'

module.exports = [ '$scope', '$state', 'AuthService', 'TrackerService', '$translate', '$location', '$window', 'SessionService', '$rootScope',
  function ($scope, $state, AuthService, TrackerService, $translate, $location, $window, SessionService, $rootScope) {
  // Initialization

  $scope.PageOptions.pageClass = 'login-page'
  $scope.user = {
    email: '',
    password: ''
  }
  $scope.error = ''
  $scope.infoMessage = ''
  $scope.facebookLoginTemplate = '<i class="fa fa-lg fa-facebook" aria-hidden="true"></i> Login with Facebook'
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.loading = !$rootScope.isCoookieSupported

  // TRANSLATE DEMO - START
  $scope.changeLang = function (lang) {
    $translate.use(lang)
  }

  $scope.fetchErrorCode = function () {
    // Get error code from server async
    var errorCodeFromServer = '404'
    $translate('ERRORS.' + errorCodeFromServer).then(function (translationMsg) {
      $scope.error = translationMsg
    })
  }
  // TRANSLATE DEMO - END

  $scope.forgotLink = function () {
    $scope.showForgotModal = true
  }

  $scope.closeModal = function () {
    $scope.showForgotModal = false
  }

  $scope.submitForgotPassword = function (emailController) {
    emailController.$setTouched()
    emailController.$validate()
    var emailValue = emailController.$viewValue
    if (emailController.$valid) {
      $scope.loading = true

      var successFn = function () {
        TrackerService.create('forgot', {
          email: emailValue
        })
        $scope.error = ''
        $scope.infoMessage = 'Please check your email for password reset instructions.'
        $scope.loading = false
        $scope.showForgotModal = false
      }
      var errorFn = function (err) {
        TrackerService.trackFormErrors('forgot form', emailValue)
        $scope.loading = false
        $scope.showForgotModal = false
        $scope.infoMessage = ''
        $scope.error = err.message
      }

      AuthService.forgotPassword(emailValue, successFn, errorFn)
    }
  }

  // Functions
  $scope.localLogin = function () {
    var u = $scope.user
    if (u.email === '') {
      $scope.error = 'Please enter email'
      return
    }
    if (u.password === '') {
      $scope.error = 'Please enter password'
      return
    }
    $scope.loading = true
    $scope.error = ''
    var credentials = {
      rememberMe: true,
      email: u.email,
      password: u.password
    }
    var success = function () {
      TrackerService.create('login success', {
        roleType: AuthService.getCurrentUser().roles[0] === 'user' ? 'Payer' : 'Payee'
      })

      $state.go('dashboard.summary.components')
    }
    var error = function (err) {
      TrackerService.trackFormErrors('login error', err.message)
      $scope.loading = false
      $scope.error = err.message
      TrackerService.create('login error', {
        errorMessage: err.message,
        email: $scope.user.email
      })
    }
    AuthService.login(credentials, success, error)
  }

  $scope.facebookLogin = function () {
    $scope.loading = true
    var success = function (user) {
      var roleType = AuthService.getIsParent() ? 'Payer' : 'Payee'
      TrackerService.create('Login Facebook', {roleType: roleType})
     $state.go('dashboard.summary.components')
    }
    var error = function (err) {
      console.log(err)
      $scope.loading = false
    }
    AuthService.loginFacebook(success, error)
  }

}]
