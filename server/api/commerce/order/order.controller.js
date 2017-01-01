'use strict'

const logger = require('../../../config/logger')
const OrderService = require('./order.service')
const OrganizationService = require('../../organization/organization.service')
var csv = require('express-csv')

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
    if (!organizationData.paymentId) return res.status(400).json({message: 'Organization does not activated', status: '400'})
    OrderService.orderGetOrganization(organizationData.paymentId, req.params.limit, req.params.sort, req.params.from, req.params.to, function (err, result) {
      if (err) return res.status(400).json(err)
      return res.status(200).json(result)
    })
  })
}

exports.orderSearch = function (req, res) {
  if (!req.body.params) {
    return handleError(res, { name: 'ValidationError', message: 'params is required' })
  }

  OrderService.orderSearch(req.body.params, function (err, data) {
    if (err) {
      return res.status(500).json({code: 'commerceService.orderSearch', message: JSON.stringify(err)})
    }
    return res.status(200).json(data)
  })
}

exports.orderHistory = function (req, res) {
  if (!req.body.orderId) {
    return handleError(res, { name: 'ValidationError', message: 'orderId is required' })
  }

  OrderService.orderHistory(req.body, function (err, data) {
    if (err) {
      return res.status(500).json({code: 'commerceService.orderHistory', message: JSON.stringify(err)})
    }
    return res.status(200).json(data)
  })
}

exports.orderHistory = function (req, res) {
  if (!req.body.orderId) {
    return handleError(res, { name: 'ValidationError', message: 'orderId is required' })
  }

  OrderService.orderHistory(req.body, function (err, data) {
    if (err) {
      return res.status(500).json({code: 'commerceService.orderHistory', message: JSON.stringify(err)})
    }
    return res.status(200).json(data)
  })
}

exports.orderTransactions = function (req, res) {
  OrganizationService.getOrganization(req.body.organizationId, function (err, organizationData) {
    if (err) return res.status(400).json(err)
    if (!organizationData.paymentId) return res.status(400).json({message: 'Organization does not activated', status: '400'})
    
    OrderService.orderTransactions(organizationData.paymentId, function (err, data) {
    if (err) {
      return res.status(500).json({code: 'commerceService.orderTransactions', message: JSON.stringify(err)})
    }
    return res.status(200).json(data)
  })

  })
}

exports.editOrder = function (req, res) {
  let user = req.user
  if (!req.body.orderId) {
    return handleError(res, { name: 'ValidationError', message: 'order id is required' })
  }
  if (!req.body.paymentPlanId) {
    return handleError(res, { name: 'ValidationError', message: 'paymen plan id is required' })
  }
  req.body.userSysId = user._id
  OrderService.editOrder(req.body, function (err, data) {
    if (err) {
      return res.status(500).json({code: 'OrderService.editOrder', message: JSON.stringify(err)})
    }
    return res.status(200).json(data.body)
  })
}

exports.orderCancel = function (req, res) {
  let user = req.user
  if (!req.body.orderId) {
    return handleError(res, { name: 'ValidationError', message: 'order id is required' })
  }
  req.body.userSysId = user._id
  OrderService.orderCancel(req.body, function (err, data) {
    if (err) {
      return res.status(500).json({code: 'OrderService.canelOrder', message: JSON.stringify(err)})
    }
    return res.status(200).json(data.body)
  })
}

exports.editAllPaymentsPlanByOrder = function (req, res) {
  let user = req.user
  if (!req.body.orderId) {
    return handleError(res, { name: 'ValidationError', message: 'order _id is required' })
  }
  if (!req.body.paymentsPlan) {
    return handleError(res, { name: 'ValidationError', message: 'paymentsPlan is required' })
  }

  req.body.userSysId = user._id
  OrderService.editAllPaymentsPlan(req.body, function (err, data) {
    if (err) {
      return res.status(500).json({code: 'commerceService.editOrder', message: JSON.stringify(err)})
    }
    return res.status(200).json(data.body)
  })
}

exports.addPaymentPlan = function (req, res) {
  let user = req.user
  if (!req.body.orderId || !req.body.description || !req.body.dateCharge || !req.body.price ||
    !req.body.account) {
    return handleError(res, { name: 'ValidationError', message: 'These params are required: description, dateCharge, originalPrice, account' })
  }

  req.body.userSysId = user._id
  OrderService.addPaymentPlan(req.body, function (err, data) {
    if (err) {
      return res.status(500).json({code: 'commerceService.addPaymenPlan', message: JSON.stringify(err)})
    }
    return res.status(200).json(data.body)
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
