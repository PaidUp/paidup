'use strict'
var angular = require('angular')

module.exports = ['$scope', 'AuthService', 'TrackerService', '$translate', '$location', '$window', 'SessionService', '$rootScope',
  function ($scope, AuthService, TrackerService, $translate, $location, $window, SessionService, $rootScope) {
    // Initialization

    $scope.PageOptions.pageClass = 'login-page'
    $scope.user = {
      email: '',
      password: ''
    }
    $scope.error = ''
    $scope.infoMessage = ''
    $scope.messageReset = ''
    $scope.facebookLoginTemplate = '<i class="fa fa-lg fa-facebook" aria-hidden="true"></i> Login with Facebook'
    $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
    $scope.loading = !$rootScope.isCoookieSupported

    $scope.init = function () {
      if (AuthService.getresetPass()) {
        $scope.showResetModal = true
      }
      TrackerService.track('Page Viewed')
    }

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
          $scope.error = ''
          $scope.infoMessage = 'Please check your email for password reset instructions.'
          $scope.loading = false
          $scope.showForgotModal = false
        }
        var errorFn = function (err) {
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
      var success = function (user) {
        $location.path(getRedirectPageLogin(user))
        AuthService.trackerLogin('Login', 'Email')
        $rootScope.checkZD();
      }
      var error = function (err) {
        $scope.loading = false
        $scope.error = err.message
      }
      AuthService.login(credentials, success, error)
    }

    $scope.facebookLogin = function () {
      $scope.loading = true
      var success = function (user) {
        $location.path(getRedirectPageLogin(user))
        AuthService.trackerLogin('Login', 'Facebook')
        $rootScope.checkZD();
      }
      var error = function (err) {
        console.log("facebookLogin error")
        console.log(err)
        $scope.loading = false
      }
      AuthService.loginFacebook(success, error)
    }

    function getRedirectPageLogin(user) {
      var next = SessionService.getPathAfterLogin();
      if (next) {
        return next;
      }

      if (user.roles.indexOf('coach') !== -1) {
        return '/dashboard/board'
      } else {
        return '/dashboard/summary'
      }
    }

    $scope.submitResetPassword = function (f) {
      f.uresetPassword.$setTouched()
      f.uresetPassword.$validate()
      var passValue = f.uresetPassword.$viewValue
      if (f.$valid) {
        $scope.loading = true

        var successFn = function (data) {
          $scope.messageReset = 'password updated successfully.'
          $scope.loading = false
          $scope.showResetModal = false
          AuthService.setresetPass(false)
        }
        var errorFn = function (err) {
          $scope.loading = false
          $scope.showResetModal = false
          $scope.messageReset = err.message
          AuthService.setresetPass(false)
        }
        AuthService.resetPassword(AuthService.getresetPass(), passValue, successFn, errorFn)
      }
    }

    $scope.validatePassword = function (f) {
      if (!angular.equals(f.uresetPassword.$viewValue, f.uresetPasswordMatch.$viewValue) || (f.uresetPassword.$viewValue === undefined && f.uresetPasswordMatch.$viewValue === undefined)) {
        f.uresetPasswordMatch.$setValidity('match', false)
      } else {
        f.uresetPasswordMatch.$setValidity('match', true)
      }
    }
  }]
