'use strict'

module.exports = [ '$scope', '$state', 'AuthService', 'TrackerService', function ($scope, $state, AuthService, TrackerService) {
  $scope.PageOptions.pageClass = 'loginpage'
  $scope.PageOptions.showHeader = false
  $scope.PageOptions.showFooter = true
  $scope.user = {}

  $scope.localLogin = function () {
    console.log('login', $scope.user)
    var credentials = {
      rememberMe: true,
      email: $scope.user.email,
      password: $scope.user.password
    }
    var success = function () {
      // Logged in, redirect to home
      $state.go(AuthService.getDest())
      AuthService.setDest()

      console.log('user', AuthService.getCurrentUser())

      TrackerService.create('login success', {
        roleType: AuthService.getCurrentUser().roles[0] === 'user' ? 'Payer' : 'Payee'
      })
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
      console.log('user', AuthService.getCurrentUser())
      var roleType = AuthService.getIsParent() ? 'Payer' : 'Payee'
      TrackerService.create('Login Facebook', {roleType: roleType})
      $state.go(AuthService.getDest())
      AuthService.setDest()
    }
    var error = function (err) {
      console.log(err)
    }
    AuthService.loginFacebook(success, error)
  }
}]
