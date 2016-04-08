'use strict'

let config = require('../../../config/environment/index')
const PUScheduleConnect = require('pu-schedule-connect')
const logger = require('../../../config/logger')

function calculateDues (params, cb) {
  let req = {
    baseUrl: config.connections.schedule.baseUrl,
    token: config.connections.schedule.token,
    prices: params
  }
  PUScheduleConnect.calculatePrices(req).exec({
    error: function (err) {
      return cb(err)
    },
    success: function (result) {
      return cb(null, result)
    }
  })
}

module.exports = function (conf) {
  if (conf) {
    logger.debug('set new configuration', conf)
    config = conf
  }

  return {
    calculateDues: calculateDues
  }
}
