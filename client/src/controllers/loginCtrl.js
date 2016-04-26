'use strict'

module.exports = [ '$scope', '$state', 'AuthService', 'TrackerService', '$translate', function ($scope, $state, AuthService, TrackerService, $translate) {
  // Initialization
  $scope.PageOptions.pageClass = 'login-page'
  $scope.user = {
    email: '',
    password: ''
  }
  $scope.error = ''

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
      $state.go('dashboard.summary')
    }
    var error = function (err) {
      TrackerService.trackFormErrors('login error', err.message)
      $scope.error = err.message
      TrackerService.create('login error', {
        errorMessage: err.message,
        email: $scope.user.email
      })
    }
    AuthService.login(credentials, success, error)
  }

  $scope.facebookLogin = function () {
    var success = function (user) {
      var roleType = AuthService.getIsParent() ? 'Payer' : 'Payee'
      TrackerService.create('Login Facebook', {roleType: roleType})
      $state.go('dashboard.summary')
    }
    var error = function (err) {
      console.log(err)
    }
    AuthService.loginFacebook(success, error)
  }
}]
