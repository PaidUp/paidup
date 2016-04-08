'use strict'

const paymentService = require('../payment.service')

exports.updateCustomer = function (req, res) {
  let data = {accountId: req.user.meta.TDPaymentId, data: {default_source: req.body.cardId}}
  paymentService.updateCustomer(data, function (err, data) {
    if (err) {
      handleError(res, err)
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
