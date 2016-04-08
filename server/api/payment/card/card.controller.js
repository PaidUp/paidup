'use strict'

const userService = require('../../user/user.service')
const paymentService = require('../payment.service')
const camelize = require('camelize')

exports.associate = function (req, res) {
  if (!req.body || !req.body.cardId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Card id is missing'
    })
  }
  let cardId = req.body.cardId
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

      paymentService.associateCard(userPrepared.meta.TDPaymentId, cardId, function (err, dataAssociate) {
        if (err) {
          return handleError(res, err)
        }
        return res.status(200).json(dataAssociate)
      })
    })
  })
}

exports.listCards = function (req, res) {
  let userId = req.params.userId || req.user._id
  let filter = { _id: userId }
  userService.find(filter, function (err, dataUser) {
    if (err) {
      return handleError(res, err)
    }
    if (dataUser[0].meta.TDPaymentId !== '') {
      paymentService.listCards(dataUser[0].meta.TDPaymentId, function (errCard, dataCards) {
        paymentService.fetchCustomer(dataUser[0].meta.TDPaymentId, function (errCustomer, dataCustomer) {
          if (errCard || errCustomer) {
            return res.status(400).json({
              'code': 'ValidationError',
              'message': 'customer Card is not valid'
            })
          }
          if (!dataCards) {
            return res.status(400).json({
              'code': 'ValidationError',
              'message': 'User without cards'
            })
          }
          dataCards.defaultSource = dataCustomer.defaultSource
          return res.status(200).json(camelize(dataCards))
        })
      })
    } else {
      return res.status(200).json({ data: [] })
    }
  })
}

exports.getCard = function (req, res) {
  if (!req.params.id) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Card number is required'
    })
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
          'message': 'User without TDPaymentId'
        })
      }
      paymentService.fetchCard(req.params.id, function (err, dataCard) {
        if (err) {
          return res.status(400).json({
            'code': 'ValidationError',
            'message': 'Card is not valid'
          })
        }
        if (!dataCard) {
          return res.status(400).json({
            'code': 'ValidationError',
            'message': 'User without Card'
          })
        }
        return res.status(200).json(camelize(dataCard))
      })
    })
  })
}

function handleError (res, err) {
  let httpErrorCode = 500
  if (err.name === 'ValidationError' || err.code === 'StripeCardError') {
    httpErrorCode = 400
  }
  return res.status(httpErrorCode).json({
    code: err.type,
    message: err.message,
    errors: err.details
  })
}
