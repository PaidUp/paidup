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

exports.failed = function (req, res) {
  console.log('failed')
  console.log('req.body', req.body)
  return res.status(200).json({webhook: 'failed'})
}

exports.succeeded = function (req, res) {
  console.log('succeeded')
  console.log('req.body', req.body)
  orderService.orderUpdateWebhook(req.body.data, function (err, result) {
    console.log(err, err)
    console.log('result', result)
    return res.status(200).json({webhook: 'charge'})
  })
  return res.status(200).json({webhook: 'succeeded'})
}

exports.updated = function (req, res) {
  console.log('updated')
  console.log('req.body', req.body)
  return res.status(200).json({webhook: 'updated'})
}

exports.ccaptured = function (req, res) {
  console.log('ccaptured')
  console.log('req.body', req.body)
  return res.status(200).json({webhook: 'ccaptured'})
}

exports.cfailed = function (req, res) {
  console.log('cfailed')
  console.log('req.body', req.body)
  return res.status(200).json({webhook: 'cfailed'})
}

exports.crefunded = function (req, res) {
  console.log('crefunded')
  console.log('req.body', req.body)
  return res.status(200).json({webhook: 'crefunded'})
}

exports.csucceeded = function (req, res) {
  console.log('csucceeded')
  console.log('req.body', req.body)
  return res.status(200).json({webhook: 'csucceeded'})
}

exports.cupdated = function (req, res) {
  console.log('cupdated')
  console.log('req.body', req.body)
  return res.status(200).json({webhook: 'cupdated'})
}
