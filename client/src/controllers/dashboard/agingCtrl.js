'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'TrackerService', function ($scope, AuthService, $state, TrackerService) {
  $scope.expandSection1 = true
  $scope.expandSection2 = true

  $scope.init = function () {
    TrackerService.track('View Aging')
  }

  $scope.downloadAsCSV = function () {
    TrackerService.track('Download as CSV', {Report: 'Aging'})
  }
  // DATE PICKER
  $scope.popup1 = {
    opened: false
  }

  $scope.popup2 = {
    opened: false
  }

  $scope.open1 = function () {
    $scope.popup1.opened = true
  }

  $scope.open2 = function () {
    $scope.popup2.opened = true
  }

  $scope.dateOptions1 = {
    maxDate: $scope.dt2,
    showWeeks: false
  }

  $scope.dateOptions2 = {
    minDate: $scope.dt1,
    showWeeks: false
  }

  $scope.change1 = function () {
    var formatOptions = { month: '2-digit', day: '2-digit', year: 'numeric' }
    console.log($scope.dt1.toLocaleDateString('en-US', formatOptions))
    $scope.dateOptions2 = {
      minDate: $scope.dt1,
      showWeeks: false
    }
  }

  $scope.change2 = function () {
    var formatOptions = { month: '2-digit', day: '2-digit', year: 'numeric' }
    console.log($scope.dt2.toLocaleDateString('en-US', formatOptions))
    $scope.dateOptions1 = {
      maxDate: $scope.dt2,
      showWeeks: false
    }
  }
}]
