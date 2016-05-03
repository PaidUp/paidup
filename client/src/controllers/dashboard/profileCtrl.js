'use strict'

module.exports = [ '$scope', 'AuthService', '$state', function ($scope, AuthService, $state) {
  $scope.editName = false
  $scope.loading = false
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
}]
