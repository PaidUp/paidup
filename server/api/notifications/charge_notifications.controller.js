'use strict'

const logger = require('../../config/logger')
const config = require('../../config/environment')

exports.start = function (req, res) {
  return res.status(500).json({error:"not implemented"});
}

exports.stop = function (req, res) {
  return res.status(500).json({error:"not implemented"});
}

exports.status = function (req, res) {
  return res.status(500).json({error:"not implemented"});
}

function handleError (res, err) {
  var httpErrorCode = 500

  if (err.name === 'ValidationError') {
    httpErrorCode = 400
  }
  logger.log('error', err)

  return res.status(httpErrorCode).json({ code: err.name, message: err.message, errors: err.errors })
}
