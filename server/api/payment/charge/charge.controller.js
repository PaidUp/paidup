'use strict'

const paymentService = require('../payment.service')
const organizationService = require('../../organization/organization.service')
const R = require('ramda')

exports.getChargesList = function (req, res) {
  organizationService.getOrganization(req.params.destinationId, function (err, org) {
    if (err) {
      return handleError(res, err)
    }
    // TODO !org.paymentId
    paymentService.retrieveAccount(org.paymentId, function (err, listbanks) {
      if (err) {
        return handleError(res, err)
      }
      paymentService.getChargesList(org.paymentId, function (err, data) {
        if (err) {
          return handleError(res, err)
        }
        let bycreated = R.groupBy(function (charge) {
          // console.log('charge', charge)
          return charge.created.substring(0, 10)
        })
        // let ordersId = R.uniq(data.data.map(c => {
          // return c.metadata._id
        // }))
        // console.log('data.data.length', data.data.length)
        let result = bycreated(data.data)
        let total = data.data.reduce((t, c) => {
          // return t + (c.amount / 100)
          return t + ((c.amount / 100) - c.metadata.totalFee)
        }, 0)
        return res.status(200).json({data: result, total: total, bankName: listbanks.external_accounts.data[0].bank_name})
      })
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
