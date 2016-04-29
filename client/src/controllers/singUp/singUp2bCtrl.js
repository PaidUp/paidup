'use strict'

module.exports = [ '$scope', 'SingUpService', '$state', 'UserService', 'AuthService', function ($scope, SingUpService, $state, UserService, AuthService) {
  $scope.user = {}
  var isFacebookSingUp = SingUpService.getFacebookSingUp()
  if (isFacebookSingUp) {
    var currentUser = AuthService.getCurrentUser()
    $scope.user.firstName = currentUser.firstName
    $scope.user.lastName = currentUser.lastName
    // Setting just for the tracker service below
    SingUpService.setCredentials({email: currentUser.email, password1: ''})
    console.log('currentUser', currentUser)
  }
  $scope.states = UserService.getStates()
  $scope.loading = false
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.next = function () {
    // Validation start
    var f = $scope.form
    // $scope.validateTerms(f)
    SingUpService.runFormControlsValidation(f)
    if (f.$valid) {
      console.log('VALID')
      console.log(SingUpService.saveBusinessInfo($scope.user))
      SingUpService.createPersonalAccount($scope.user).then(function (message) {
        console.log('$scope.user2b', $scope.user)
        $state.go('^.step3b')
      }, function (err) {
        console.log('ERROR', err)
        $scope.error = err
        $scope.loading = false
      })
    } else {
      console.log('INVALID')
    }
  }
}]
