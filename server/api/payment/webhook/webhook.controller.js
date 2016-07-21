'use strict'

const webhookService = require('./webhook.service')

exports.webpost = function (req, res) {
  webhookService.sendEmail(req.body, '', function (err, data) {
    return res.status(200).json({webhook: 'POST'})
  })
}

exports.webget = function (req, res) {
  webhookService.sendEmail(req.query, '', function (err, data) {
    return res.status(200).json({webhook: 'GET'})
  })
}

exports.webgetpaymentcharge = function (req, res) {
  webhookService.sendEmail(req.body, '[Charge]', function (err, data) {
    return res.status(200).json({webhook: 'TODO verifyAndUpdateOrdersWithBankAccounts'})
  })
}
