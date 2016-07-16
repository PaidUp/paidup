'use strict'

const paymentService = require('../payment.service')
const userService = require('../../user/user.service')
const camelize = require('camelize')

exports.authenticate = function (req, res) {
  paymentService.plaidAuthenticate(req.body, function (err, account) {
    console.log('err', err)
    console.log('account', account)
    if (err) {
      return handleError(res, err)
    }
    let filter = { _id: req.user._id }
    userService.find(filter, function (err, dataUser) {
      if (err) {
        return handleError(res, err)
      }
      paymentService.prepareUser(dataUser[0], function (err, userPrepared) {
        if (err) {
          return handleError(res, err)
        }
        if (!userPrepared.meta.TDPaymentId) {
          return res.status(400).json({
            'code': 'ValidationError',
            'message': 'user without TDPaymentId'
          })
        }
        paymentService.associateCard(userPrepared.meta.TDPaymentId, account.stripe_bank_account_token, function (err, dataAssociate) {
          console.log('err', err)
          console.log('dataAssociate', dataAssociate)
          if (err) {
            return handleError(res, err)
          }
          return res.status(200).json(dataAssociate)
        })
      })
    })
  })
}

exports.listBanks = function listBanks (req, res) {
  let userId = req.params.userId || req.user._id
  let filter = { _id: userId }
  userService.find(filter, function (err, dataUser) {
    if (err) {
      return handleError(res, err)
    }
    if (dataUser[0].meta.TDPaymentId !== '') {
      paymentService.listBanks(dataUser[0].meta.TDPaymentId, function (errCard, dataBanks) {
        paymentService.fetchCustomer(dataUser[0].meta.TDPaymentId, function (errCustomer, dataCustomer) {
          if (errCard || errCustomer) {
            return res.status(400).json({
              'code': 'ValidationError',
              'message': 'customer Card is not valid'
            })
          }
          if (!dataBanks) {
            return res.status(400).json({
              'code': 'ValidationError',
              'message': 'User without cards'
            })
          }
          dataBanks.defaultSource = dataCustomer.defaultSource
          return res.status(200).json(camelize(dataBanks))
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
