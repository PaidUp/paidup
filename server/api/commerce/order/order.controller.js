'use strict'

const logger = require('../../../config/logger')
const OrderService = require('./order.service')

exports.createOrder = function (req, res) {
  let user = req.user
  let params = req.body
  params.userId = user._id
  params.userName = user.firstName + ' ' + user.lastName
  params.paymentId = user.meta.TDPaymentId
  params.email = user.email
  OrderService.createOrder(params, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    return res.status(200).json(data)
  })
}

function handleError (res, err) {
  let httpErrorCode = 500
  if (err.name === 'ValidationError') {
    httpErrorCode = 400
  }
  logger.log('error', err)
  return res.status(httpErrorCode).json({ code: err.name, message: err.message, errors: err.errors })
}
