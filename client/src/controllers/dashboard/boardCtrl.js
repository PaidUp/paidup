'use strict'

module.exports = ['$scope', 'AuthService', '$state', 'CommerceService', 'TrackerService', 'SessionService',
  function ($scope, AuthService, $state, CommerceService, TrackerService, SessionService) {
    $scope.getSubTotal = function getSubTotals(orders, key) {
      return orders.reduce(function (result, order) {
        return result + order[(!key || key !== 'sumPrice') ? 'sumbasePrice' : key]
      }, 0)
    }

    $scope.getSubTotalDiscount = function getSubTotalDiscount(orders, key) {
      return orders.reduce(function (result, order) {
        return result + order.paymentsPlan.reduce(function (prevDiscount, pp) {
          var sum = pp[(!key || key !== 'price') ? 'originalPrice' : key] * (pp.discount / 100)
          return prevDiscount + sum
        }, 0)
      }, 0)
    }

    $scope.getSubTotalPaid = function getSubTotalPaid(orders, key) {
      return orders.reduce(function (result, order) {
        return result + order.paymentsPlan.reduce(function (previousPrice, pp) {
          // var sum = (pp.status === 'succeeded') ? (pp[(!key || key !== 'price') ? 'basePrice' : key] - pp.totalFee) : 0
          var sum = (pp.status === 'succeeded' || pp.status === 'refunded-partially') ? (pp[(!key || key !== 'price') ? 'basePrice' : key]) : 0
          return previousPrice + sum
        }, 0)
      }, 0)
    }
    $scope.getSubTotalRemaining = function getSubTotalRemaining(subTotals, key) {
      var res = subTotals.reduce(function (result, sTotals) {
        if (sTotals.status !== "canceled") {
          return result + sTotals.paymentsPlan.reduce(function (previousPrice, pp) {
            // var sum = (pp.status === 'failed' || pp.status === 'pending') ? (pp[(!key || key !== 'price') ? 'originalPrice' : key]) : 0
            var sum = (pp.status === 'failed' || pp.status === 'pending') ? (pp[(!key || key !== 'price') ? 'basePrice' : key] - pp.totalFee) : 0
            return previousPrice + sum
          }, 0)
        } else {
          return 0
        }
      }, 0);
      return res;
    }

    function getTotalRemaining(orders) {
      var res = orders.reduce(function (result, sTotals) {
        if (sTotals.status !== "canceled") {
          return result + sTotals.paymentsPlan.reduce(function (previousPrice, pp) {
            var sum = (pp.status === 'failed' || pp.status === 'pending') ? (pp.price - pp.totalFee) : 0
            return previousPrice + sum
          }, 0)
        } else {
          return 0
        }
      }, 0);
      return res;
    }

    $scope.getCVS = function getCVS() {
      downloadCSV({})
    }

    function convertArrayOfObjectsToCSV(args) {
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

    function downloadCSV(args) {
      var data
      var filename
      var link
      var csv = convertArrayOfObjectsToCSV({
        data: [$scope.groupProducts]
      })
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
      TrackerService.track('Download as CSV', { Report: 'Dashboard' })
    }

    $scope.dt1 = SessionService.getDashboardDate();
    $scope.dt2 = new Date();
    $scope.dt2.setHours(23, 59, 59, 0);

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
        var teams = user.teams.join();
        CommerceService.orderGetOrganization(organizationId, 200, -1, $scope.dt1, $scope.dt2, teams).then(function (result) {
          var finalResult = R.groupBy(function (order) {
            //console.log(order)
            return order.allProductName[0]
          })
          var fn = finalResult(result.body)
          var gp = {}
          Object.keys(fn).sort().forEach(function (v, i) {
            var productInfo = fn[v]
            var subTotal = 0
            var subDiscount = 0
            var subPaid = 0
            var subRemaining = 0

            var newProductInfo = productInfo.map(function (ele) {
              var total = ele.sumPrice
              $scope.totalPriceFees = $scope.totalPriceFees + total;
              var discount = $scope.getSubTotalDiscount([ele])
              $scope.totalDiscountFees = $scope.totalDiscountFees + discount
              var paid = $scope.getSubTotalPaid([ele], 'price')
              $scope.totalPaidFees = $scope.totalPaidFees + paid
              var remaining = $scope.getSubTotalRemaining([ele], 'price')
              $scope.totalRemainingFees = $scope.totalRemainingFees + remaining
              subTotal = total + subTotal
              subDiscount = subDiscount + discount
              subPaid = subPaid + paid;
              subRemaining = subRemaining + remaining
              ele['discount'] = discount
              ele['paid'] = paid
              ele['remaining'] = remaining
              return ele;
            });

            gp[v] = {
              total: subTotal,
              discount: subDiscount,
              paid: subPaid,
              remaining: subRemaining,
              pps: newProductInfo
            }
          })
          $scope.groupProducts = gp
        }).catch(function (err) {
          console.log('err', err)
        })

        CommerceService.getTransactions(organizationId).then(function (resp) {
          $scope.contentCsv = resp.content;
          $scope.headerCsv = resp.header;
        }).catch(function (err) {
          console.log("ERR: ", err)
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
      $scope.dateOptions2 = {
        minDate: $scope.dt1,
        showWeeks: false
      }
      SessionService.setDashboardDate($scope.dt1);
      $scope.init();
    }

    $scope.change2 = function () {
      var formatOptions = { month: '2-digit', day: '2-digit', year: 'numeric' }
      $scope.dateOptions1 = {
        maxDate: $scope.dt2,
        showWeeks: false
      }
      $scope.init();
    }

    $scope.getBeneficiaryInfo = function getBeneficiaryInfo(customInfo) {
      return CommerceService.getVisibleBeneficiaryData(customInfo)
    }

    $scope.lstPaymentsHistory = function (pps) {
      var res = pps.filter(function (pp) {
        return (pp.status !== 'failed' && pp.status !== 'pending')
      })
      return res;
    }

    $scope.lstPaymentsPending = function (pps) {
      var res = pps.filter(function (pp) {
        return (pp.status === 'failed' || pp.status === 'pending')
      })
      return res
    }

    $scope.getPaymentsHistory = function (pp) {
      return (pp.status !== 'failed' && pp.status !== 'pending')
    }

    $scope.getPaymentsPending = function (pp) {
      return (pp.status === 'failed' || pp.status === 'pending')
    }

    $scope.setDataCustomInfo = function setDataCustomInfo(customInfo) {
      return CommerceService.setDataCustomInfo(customInfo)
    }

    $scope.export = function () {
      console.log('export .....');
    }

  }]
