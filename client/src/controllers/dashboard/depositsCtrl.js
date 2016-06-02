'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'TrackerService', function ($scope, AuthService, $state, TrackerService) {
  $scope.expandSection1 = false
  $scope.expandSection2 = false

  $scope.init = function (){
    TrackerService.track('View Deposits');
  }

  $scope.downloadAsCSV = function (){
    TrackerService.track('Download as CSV', {Report: 'Deposits'});
  }
}]
