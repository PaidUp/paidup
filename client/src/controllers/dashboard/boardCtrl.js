'use strict'

module.exports = [ '$scope', 'AuthService', '$state', 'CommerceService', 'TrackerService', function ($scope, AuthService, $state, CommerceService, TrackerService) {
  $scope.getSubTotal = function getSubTotals (orders, key) {
    return orders.reduce(function (result, order) {
      return result + order[(!key || key !== 'sumPrice') ? 'sumbasePrice' : key]
    }, 0)
  }

  $scope.getSubTotalDiscount = function getSubTotalDiscount (orders, key) {
    return orders.reduce(function (result, order) {
      return result + order.paymentsPlan.reduce(function (prevDiscount, pp) {
        var sum = pp[(!key || key !== 'price') ? 'originalPrice' : key] * (pp.discount / 100)
        return prevDiscount + sum
      }, 0)
    }, 0)
  }

  $scope.getSubTotalPaid = function getSubTotalPaid (orders, key) {
    return orders.reduce(function (result, order) {
      return result + order.paymentsPlan.reduce(function (previousPrice, pp) {
        // var sum = (pp.status === 'succeeded') ? (pp[(!key || key !== 'price') ? 'basePrice' : key] - pp.totalFee) : 0
        var sum = (pp.status === 'succeeded') ? (pp[(!key || key !== 'price') ? 'basePrice' : key]) : 0
        return previousPrice + sum
      }, 0)
    }, 0)
  }

  $scope.getSubTotalRemaining = function getSubTotalRemaining (subTotals, key) {
    return subTotals.reduce(function (result, sTotals) {
      return result + sTotals.paymentsPlan.reduce(function (previousPrice, pp) {
        var sum = (pp.status === 'failed' || pp.status === 'pending') ? (pp[(!key || key !== 'price') ? 'basePrice' : key] - pp.totalFee) : 0
        return previousPrice + sum
      }, 0)
    }, 0)
  }

  $scope.getCVS = function getCVS () {
    downloadCSV({})
  }

  function convertArrayOfObjectsToCSV (args) {
    // http://halistechnology.com/2015/05/28/use-javascript-to-export-your-data-as-csv/
    // http://csv.adaltas.com/generate/
    // https://github.com/voodootikigod/node-csv
    // https://github.com/koles/ya-csv
    // https://www.npmjs.com/package/csv

    var result, ctr, keys, columnDelimiter, lineDelimiter, data

    data = args.data || null
    if (data == null || !data.length) {
      return null
    }

    columnDelimiter = args.columnDelimiter || ','
    lineDelimiter = args.lineDelimiter || '\n'

    keys = Object.keys(data[0])

    result = ''
    result += keys.join(columnDelimiter)
    result += lineDelimiter
    data.forEach(function (item) {
      ctr = 0
      keys.forEach(function (key) {
        if (ctr > 0) result += columnDelimiter

        result += item[key]
        ctr++
      })
      result += lineDelimiter
    })
    return result
  }

  function downloadCSV (args) {
    var data
    var filename
    var link
    var csv = convertArrayOfObjectsToCSV({
      data: [$scope.groupProducts]
    })
    console.log('csv', csv)
    if (csv == null) return

    filename = args.filename || 'export.csv'

    if (!csv.match(/^data:text\/csv/i)) {
      csv = 'data:text/csv;charset=utf-8,' + csv
    }
    data = encodeURI(csv)

  // link = document.createElement('a')
  // link.setAttribute('href', data)
  // link.setAttribute('download', filename)
  // link.click()
  }

  $scope.downloadAsCSV = function () {
    TrackerService.track('Download as CSV', {Report: 'Dashboard'})
  }

  $scope.init = function () {
    TrackerService.track('View Dashboard')
    $scope.expandCategory1 = false
    $scope.expandSection11 = false
    $scope.totalPrice = 0
    $scope.totalPriceFees = 0
    $scope.totalDiscount = 0
    $scope.totalDiscountFees = 0
    $scope.totalPaid = 0
    $scope.totalPaidFees = 0
    $scope.totalRemaining = 0
    $scope.totalRemainingFees = 0
    $scope.groupProducts = []
    AuthService.getCurrentUserPromise().then(function (user) {
      var organizationId = (user.meta.productRelated[0]) ? user.meta.productRelated[0] : 'Does not have organization'
      CommerceService.orderGetOrganization(organizationId, 200, -1).then(function (result) {
        $scope.totalPrice = $scope.getSubTotal(result.body)
        $scope.totalPriceFees = $scope.getSubTotal(result.body, 'sumPrice')
        $scope.totalDiscount = $scope.getSubTotalDiscount(result.body)
        $scope.totalDiscountFees = $scope.getSubTotalDiscount(result.body, 'originalPrice')
        $scope.totalPaid = $scope.getSubTotalPaid(result.body)
        $scope.totalPaidFees = $scope.getSubTotalPaid(result.body, 'price')
        $scope.totalRemaining = $scope.getSubTotalRemaining(result.body)
        $scope.totalRemainingFees = $scope.getSubTotalRemaining(result.body, 'price')
        var finalResult = R.groupBy(function (order) {
          return order.allProductName[0]
        })
        var fn = finalResult(result.body)
        var gp = {}
        Object.keys(fn).sort().forEach(function (v, i) {
          gp[v] = fn[v]
        })
        $scope.groupProducts = gp
      }).catch(function (err) {
        console.log('err', err)
      })
    })
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

  $scope.getBeneficiaryInfo = function getBeneficiaryInfo (customInfo) {
    return CommerceService.getVisibleBeneficiaryData(customInfo)
  }

  $scope.showPayments = function showPayments (pps, filter) {
    // return true
    return pps.filter(function (pp) { return (pp.status === filter || pp.status === 'failed') }).length
  }

  $scope.getPaymentsHistory = function getPaymentsHistory (pp) {
    if (pp.status === 'pending') return false
    return true
  }

  $scope.getPaymentsPending = function getPaymentsPending (pp) {
    if (pp.status === 'failed' || pp.status === 'pending') return true
    return false
  }

  $scope.setDataCustomInfo = function setDataCustomInfo (customInfo) {
    return CommerceService.setDataCustomInfo(customInfo)
  }
}]
