'use strict'

const catalogService = require('./catalog.service')
const config = require('../../../config/environment')

exports.list = function (req, res) {
  if (!req.params && !req.params.categoryId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Category Id is required'
    })
  }
  let categoryId = 0
  if (req.params.categoryId === 'teams') {
    categoryId = config.commerce.category.teams
  }
  catalogService.catalogList(categoryId, function (err, dataService) {
    if (err) return handleError(res, err)
    res.status(200).json(dataService)
  })
}

exports.catalogInfo = function (req, res) {
  if (!req.params && !req.params.productId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Product Id is required'
    })
  }
  catalogService.catalogProduct(req.params.productId, function (err, dataService) {
    if (err) return handleError(res, err)
    res.status(200).json(dataService)
  })
}

exports.groupedProducts = function (req, res) {
  if (!req.params && !req.params.productId) {
    return res.status(400).json({
      'code': 'ValidationError',
      'message': 'Product Id is required'
    })
  }
  catalogService.groupedList(req.params.productId, function (err, dataService) {
    if (err) return handleError(res, err)
    res.status(200).json(dataService)
  })
}

function handleError (res, err) {
  let httpErrorCode = 500
  if (err.name === 'ValidationError') {
    httpErrorCode = 400
  }
  return res.status(httpErrorCode).json({ code: err.name, message: err.message, errors: err.errors })
}