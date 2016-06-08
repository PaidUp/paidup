'use strict'

const logger = require('../../../config/logger')
const OrderService = require('./order.service')
const OrganizationService = require('../../organization/organization.service')

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

exports.orderPaymentRecent = function (req, res) {
  OrderService.orderPaymentRecent(req.params.userId, req.params.limit, function (err, result) {
    if (err) return res.status(400).json(err)
    return res.status(200).json(result)
  })
}

exports.orderPaymentNext = function (req, res) {
  OrderService.orderPaymentNext(req.params.userId, req.params.limit, function (err, result) {
    if (err) return res.status(400).json(err)
    return res.status(200).json(result)
  })
}

exports.orderPaymentActive = function (req, res) {
  OrderService.orderPaymentActive(req.params.userId, req.params.limit, function (err, result) {
    if (err) return res.status(400).json(err)
    return res.status(200).json(result)
  })
}

exports.orderGet = function (req, res) {
  OrderService.orderGet(req.params.userId, req.params.limit, req.params.sort, function (err, result) {
    if (err) return res.status(400).json(err)
    return res.status(200).json(result)
  })
}

exports.orderGetOrganization = function (req, res) {
  OrganizationService.getOrganization(req.params.organizationId, function (err, organizationData) {
    if (err) return res.status(400).json(err)
    OrderService.orderGetOrganization(organizationData.paymentId, req.params.limit, req.params.sort, function (err, result) {
      if (err) return res.status(400).json(err)
      return res.status(200).json(result)
    })
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
