'use strict'

module.exports = [ '$scope', '$state', 'AuthService', 'TrackerService', '$translate', '$location', '$window', 'SessionService', function ($scope, $state, AuthService, TrackerService, $translate, $location, $window, SessionService) {
  // Initialization
  $scope.PageOptions.pageClass = 'login-page'
  $scope.user = {
    email: '',
    password: ''
  }
  $scope.error = ''
  $scope.facebookLoginTemplate = '<i class="fa fa-lg fa-facebook" aria-hidden="true"></i> Login with Facebook'
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.loading = false

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

  //While finish ve implementation
  var hosts = {
    'stg.getpaidup.com' : 'https://stage.getpaidup.com/sso/',
    'login.getpaidup.com' : 'https://app.getpaidup.com/sso/'
  }

  function redirect(){
    var newHost = hosts[$location.host()];

    if(newHost){
      var token = SessionService.getCurrentSession();
      newHost = newHost+token;
      $window.location.href = newHost;
    } else {
      $state.go('dashboard.summary.components')
    }
  }
  //end




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

      redirect()


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
      redirect();
      //$state.go('dashboard.summary.components')
    }
    var error = function (err) {
      console.log(err)
      $scope.loading = false
    }
    AuthService.loginFacebook(success, error)
  }
}]
