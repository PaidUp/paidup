'use strict'

const paymentService = require('../payment.service')

exports.authenticate = function (req, res) {
  paymentService.plaidAuthenticate(req.body, function (err, accounts) {
    console.log('err', err)
    console.log('accounts', accounts)
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(accounts)
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
