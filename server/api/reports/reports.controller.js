'use strict'

var logger = require('../../config/logger')
let service = require('./reports.service')()

exports.revenueProjection = function (req, res) {
  let filter = req.body.filter
  service.revenueProjection(filter, function(err, data){
    if(err){
      return res.status(500).json(err);
    }
    return res.status(200).json(data);

  })
}

function handleError (res, err) {
  logger.error(err)
  let httpErrorCode = err.status
  return res.status(httpErrorCode).json({errors: err.errors})
}
