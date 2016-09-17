'use strict'

const paymentService = require('../payment.service')
const organizationService = require('../../organization/organization.service')
const R = require('ramda')

exports.getTransfers = function (req, res) {
  organizationService.getOrganization(req.params.destinationId, function (err, org) {
    if (err) {
      return handleError(res, err)
    }
    // TODO !org.paymentId
    paymentService.retrieveAccount(org.paymentId, function (err, listbanks) {
      if (err) {
        return handleError(res, err)
      }
      paymentService.getTransfers(org.paymentId, function (err, data) {
        if (err) {
          return handleError(res, err)
        }
        let bycreated = R.groupBy(function (charge) {
          return charge.created.substring(0, 10)
        })
        console.log('data.data.length', data.data.length)
        let result = bycreated(data.data)
        let total = data.data.reduce((t, c) => {
          return t + (c.amount / 100)
        }, 0)
        return res.status(200).json({data: result, total: total, bankName: listbanks.external_accounts.data[0].bank_name})
      })
    })
  })
}

exports.retrieveTransfer = function (req, res) {
  paymentService.retrieveTransfer(req.params.transferId, function (err, data) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(data)
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
