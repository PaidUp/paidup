'use strict'

const webhookService = require('./webhook.service')
const orderService = require('../../commerce/order/order.service')

exports.webpost = function (req, res) {
  webhookService.sendEmail(req.body, '', function (err, data) {
    console.log(err)
    return res.status(200).json({webhook: 'POST'})
  })
}

exports.webget = function (req, res) {
  webhookService.sendEmail(req.query, '', function (err, data) {
    console.log(err)
    return res.status(200).json({webhook: 'GET'})
  })
}

exports.webgetpaymentcharge = function (req, res) {
  webhookService.sendEmail(req.body, '[Charge]', function (err, data) {
    console.log(err)
    return res.status(200).json({webhook: 'TODO verifyAndUpdateOrdersWithBankAccounts'})
  })
}

exports.chargeAccount = function (req, res) {
  console.log('succeeded and failed')
  console.log('req.body.data.object.source.object', req.body.data.object.source.object)
  if (req.body.data && req.body.data.object && req.body.data.object.source && req.body.data.object.source.object === 'bank_account'){
    orderService.orderUpdateWebhook(req.body.data, function (err, result) {
      console.log(err, err)
      console.log('result', result)
      return res.status(200).json({webhook: 'charge'})
    })
  } else {
    return res.status(200).json({webhook: 'not bank_account'})
  }
}
