'use strict'

module.exports = ['$scope', 'PaymentService', 'AuthService', '$state', 'TrackerService', 'SessionService', 
function ($scope, PaymentService, AuthService, $state, TrackerService, SessionService) {
  $scope.expandSection1 = false
  $scope.expandSection2 = false
  $scope.listCharges = []
  $scope.dt1 = SessionService.getDepositDate();
  $scope.dt2 = new Date();
  $scope.init = function () {
    TrackerService.track('View Deposits')
    AuthService.getCurrentUserPromise().then(function (user) {
      var organizationId = (user.meta.productRelated[0]) ? user.meta.productRelated[0] : 'Does not have organization';
      $scope.organizationId = organizationId;
      PaymentService.getTransfers(organizationId, $scope.dt1.toLocaleDateString('en-US'), $scope.dt2.toLocaleDateString('en-US')).then(function (result) {
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

  $scope.getChargeDetails = function getChargeDetails(transfer) {
    if (!transfer.details) {
      AuthService.getCurrentUserPromise().then(function (user) {
        var organizationId = (user.meta.productRelated[0]) ? user.meta.productRelated[0] : 'Does not have organization'
        PaymentService.getBalance(organizationId, transfer.id).then(function (result) {
          transfer.details = result.data.filter(function (charge) { return charge.type === 'payment' || charge.type === 'payment_refund' || charge.type === 'adjustment' })
          // $scope.listCharges = result.data.filter(function (charge) { return charge.type === 'payment' || charge.type === 'payment_refund' || charge.type === 'adjustment' })
          transfer.details.forEach(function (tr, idx, arr) {
            loadTransactionDetails(tr);
          });
        }).catch(function (err) {
          console.log('err', err)
        })
      }).catch(function (err) {
        console.log('err', err)
      })
    }
  }

  function loadTransactionDetails(transaction) {
    if (transaction.type === 'payment_refund') {
      return PaymentService.getDepositDetilsRefund(transaction.source, $scope.organizationId).then(function (data) {
        transaction.details = data;
      }).catch(function (err) {
        console.error(err)
      })
    }

    return PaymentService.getDepositDetils(transaction.source, $scope.organizationId).then(function (data) {
      transaction.details = data;
    }).catch(function (err) {
      console.error(err)
    })
  }

  $scope.loadTransactionDetails = loadTransactionDetails;

  $scope.getSubtotal = function getSubtotal(charges) {
    return charges.reduce(function (t, c) {
      // return t + ((c.amount / 100) - c.metadata.totalFee)
      return t + (c.amount / 100)
    }, 0)
  }

  $scope.getBankName = function getBankName(charges) {
    return charges.reduce(function (t, c) {
      // return t + ((c.amount / 100) - c.metadata.totalFee)
      return c.bank_name
    }, '')
  }

  $scope.downloadAsCSV = function () {
    TrackerService.track('Download as CSV', { Report: 'Deposits' })
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
    $scope.dateOptions2 = {
      minDate: $scope.dt1,
      showWeeks: false
    }
    SessionService.setDepositDate($scope.dt1); 
    $scope.init()
  }

  $scope.change2 = function () {
    var formatOptions = { month: '2-digit', day: '2-digit', year: 'numeric' }
    $scope.dateOptions1 = {
      maxDate: $scope.dt2,
      showWeeks: false
    }
    $scope.init()
  }
}]
