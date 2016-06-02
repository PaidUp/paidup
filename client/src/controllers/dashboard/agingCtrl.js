'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'TrackerService', function ($scope, AuthService, $state, TrackerService) {
  $scope.expandSection1 = true
  $scope.expandSection2 = true

  $scope.init = function (){
    TrackerService.track('View Aging');
  }

  $scope.downloadAsCSV = function (){
    TrackerService.track('Download as CSV', {Report: 'Aging'});
  }

}]
