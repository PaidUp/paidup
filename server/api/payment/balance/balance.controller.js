'use strict'

const paymentService = require('../payment.service')
const organizationService = require('../../organization/organization.service')

exports.getBalance = function (req, res) {
  organizationService.getOrganization(req.params.destinationId, function (err, org) {
    if (err) {
      return handleError(res, err)
    }
    // TODO !org.paymentId
    paymentService.getBalance(org.paymentId, function (err, data) {
      if (err) {
        return handleError(res, err)
      }
      return res.status(200).json({balance: data})
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
