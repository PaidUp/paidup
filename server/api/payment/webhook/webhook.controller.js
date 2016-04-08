'use strict'

const webhookService = require('./webhook.service')

exports.webgetpaymentcharge = function (req, res) {
  webhookService.sendEmail(req.body, '[Charge]', function (err, data) {
    return res.status(200).json({webhook: 'webgetpaymentchargeTemp'})
  })
}
