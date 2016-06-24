'use strict'

module.exports = [ '$scope', 'PaymentService', 'AuthService', '$state', 'TrackerService', function ($scope, PaymentService, AuthService, $state, TrackerService) {
  $scope.expandSection1 = true
  $scope.expandSection2 = true
  $scope.listCharges = []
  $scope.init = function () {
    TrackerService.track('View Deposits')
    AuthService.getCurrentUserPromise().then(function (user) {
      var organizationId = (user.meta.productRelated[0]) ? user.meta.productRelated[0] : 'Does not have organization'
      PaymentService.getChargesList(organizationId).then(function (result) {
        $scope.totalAmount = result.total
        $scope.bankName = result.bankName
        $scope.listChargesGrouped = result.data
      }).catch(function (err) {
        console.log('err', err)
      })
    }).catch(function (err) {
      console.log('err', err)
    })
  }

  $scope.getSubtotal = function getSubtotal (charges) {
    return charges.reduce((t, c) => {
      return t + ((c.amount / 100) - c.metadata.totalFee)
    }, 0)
  }

  $scope.downloadAsCSV = function () {
    TrackerService.track('Download as CSV', {Report: 'Deposits'})
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
