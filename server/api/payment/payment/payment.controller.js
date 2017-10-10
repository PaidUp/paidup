'use strict'

const paymentService = require('../payment.service')
const organizationService = require('../../organization/organization.service')

exports.getDepositDetils = function (req, res) {
  organizationService.getOrganization(req.params.organizationId, function (err, org) {
    if (err) {
      return handleError(res, err)
    }
    paymentService.getDepositCharge(req.params.paymentId, org.paymentId, function (err, data) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(data)
    })
  })
}

exports.getDepositDetilsRefund = function (req, res) {
  organizationService.getOrganization(req.params.organizationId, function (err, org) {
    if (err) {
      return handleError(res, err)
    }
    paymentService.getDepositChargeRefund(req.params.paymentId, org.paymentId, function (err, data) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(data)
    })
  })
}

exports.refund = function (req, res) {
  paymentService.refund(req.body.chargeId, req.body.reason, req.body.amount, function (err, data) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(data)
    })
}

function handleError(res, err) {
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
