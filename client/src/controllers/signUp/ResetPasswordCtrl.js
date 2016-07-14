'use strict'

module.exports = ['$rootScope', '$scope', '$state', 'TrackerService', '$stateParams', 'AuthService',
  function ($rootScope, $scope, $state, TrackerService, $stateParams, AuthService) {
    if ($stateParams.token) {
      AuthService.setresetPass($stateParams.token)
      $state.go('login')
    }
  }]
