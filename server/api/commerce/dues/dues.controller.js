'use strict'

var logger = require('../../../config/logger')
let duesService = require('./dues.service')()

exports.calculateDues = function (req, res) {
  let params = req.body.prices
  duesService.calculateDues(params, function (err, data) {
    if (err) {
      return handleError(res, err)
    }
    res.status(200).json(data)
  })
}

function handleError (res, err) {
  logger.error(err)
  let httpErrorCode = err.status
  return res.status(httpErrorCode).json({errors: err.errors})
}
