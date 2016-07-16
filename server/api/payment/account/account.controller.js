'use strict'

const paymentService = require('../payment.service')
const userService = require('../../user/user.service')
const camelize = require('camelize')

exports.listAccounts = function listAccounts (req, res) {
  let userId = req.params.userId || req.user._id
  let filter = { _id: userId }
  userService.find(filter, function (err, dataUser) {
    if (err) {
      return handleError(res, err)
    }
    if (dataUser[0].meta.TDPaymentId !== '') {
      paymentService.listBanks(dataUser[0].meta.TDPaymentId, function (errBank, dataBanks) {
        paymentService.listCards(dataUser[0].meta.TDPaymentId, function (errCard, dataCards) {
          paymentService.fetchCustomer(dataUser[0].meta.TDPaymentId, function (errCustomer, dataCustomer) {
            if (errBank || errCustomer) {
              return res.status(400).json({
                'code': 'ValidationError',
                'message': 'customer Card is not valid'
              })
            }
            if (errCard || errCustomer) {
              return res.status(400).json({
                'code': 'ValidationError',
                'message': 'customer Card is not valid'
              })
            }
            if (!dataBanks && !dataCards) {
              return res.status(400).json({
                'code': 'ValidationError',
                'message': 'User without Accounts'
              })
            }
            dataCards.defaultSource = dataCustomer.defaultSource
            return res.status(200).json(camelize({data: dataBanks.data.concat(dataCards.data)}))
          })
        })
      })
    } else {
      return res.status(200).json({ data: [] })
    }
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
