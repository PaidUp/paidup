'use strict'

const cartService = require('./cart.service')
const logger = require('../../../config/logger')

// Creates a new cart in the DB.
exports.create = function (req, res) {
  cartService.cartCreate(function (err, cartId) {
    res.status(200).json({ cartId: cartId })
  })
}

exports.add = function (req, res) {
  if (!req.body && !req.body.products && !req.body.cartId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Cart Id and products are required'
    })
  }
  cartService.cartAdd(req.body, function (err, cartAdd) {
    if (err) return handleError(res, err)
    res.status(200).json(cartAdd)
  })
}

exports.remove = function (req, res) {
  if (!req.body && !req.body.products && !req.body.cartId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'cartId or products is required'
    })
  }
  cartService.cartRemove(req.body, function (err, cartRemove) {
    if (err) return handleError(res, err)
    res.status(200).json(cartRemove)
  })
}

exports.list = function (req, res) {
  if (!req.params && !req.params.id) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Cart Id is required'
    })
  }
  cartService.cartList(req.params.id, function (err, cartList) {
    if (err) return handleError(res, err)
    res.status(200).json(cartList)
  })
}

exports.address = function (req, res) {
  cartService.cartAddress(req.body, function (err, cartAddress) {
    if (err) return handleError(res, err)
    res.status(200).json(cartAddress)
  })
}

exports.view = function (req, res) {
  if (!req.params && !req.params.id) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Cart Id is required'
    })
  }
  cartService.cartView(req.params.id, function (err, cartView) {
    if (err) return handleError(res, err)
    res.status(200).json(cartView)
  })
}

exports.totals = function (req, res) {
  if (!req.params && !req.params.id) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Cart Id is required'
    })
  }
  cartService.cartTotals(req.params.id, function (err, cartTotals) {
    if (err) return handleError(res, err)
    res.status(200).json(cartTotals)
  })
}

function handleError (res, err) {
  logger.info(err, err)
  var httpErrorCode = 500
  if (err.name === 'ValidationError') {
    httpErrorCode = 400
  }
  return res.status(httpErrorCode).json({ code: err.name, message: err.message, errors: err.errors })
}

exports.couponAdd = function (req, res) {
  if (!req.body && !req.body.coupon && !req.body.productId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Product Id and coupon are required'
    })
  }

  cartService.cartCouponAdd(req.body.productId, req.body.coupon, function (err, resp) {
    if (err) {
      return res.status(err.status).json(err.message)
    }
    return res.status(200).json(resp.body)
  })
}
