'use strict'

const paymentService = require('../payment.service')
const organizationService = require('../../organization/organization.service')
var R = require('ramda')

exports.getChargesList = function (req, res) {
  organizationService.getOrganization(req.params.destinationId, function (err, org) {
    if (err) {
      return handleError(res, err)
    }
    // TODO !org.paymentId
    paymentService.getChargesList(org.paymentId, function (err, data) {
      if (err) {
        return handleError(res, err)
      }
      let bycreated = R.groupBy(function (charge) {
        return charge.created.substring(0, 10)
      })
      let result = bycreated(data.data)
      let total = data.data.reduce((t, c) => {
        // return t + (c.amount / 100)
        return t + ((c.amount / 100) - c.metadata.totalFee)
      }, 0)
      // console.log(bycreated(data.data))
      /* data.data.map(function (c) {
        console.log('transfer.date', c.created)
        console.log('transfer.date', c.created.substring(0, 10))
        console.log('transfer.date getDate', new Date(c.created).getDate())
        console.log('transfer.date getFullYear', new Date(c.created).getFullYear())
        console.log('transfer.date getMonth', new Date(c.created).getMonth())
        console.log('----------------------------------')
      })*/
      return res.status(200).json({data: result, total: total})
    })
  })
}

function handleError (res, err) {
  let httpErrorCode = 500

  if (err.name === 'ValidationError') {
    httpErrorCode = 400
  }

  return res.status(httpErrorCode).json({
    code: err.name,
    message: err.message,
    errors: err.errors
  })
}
