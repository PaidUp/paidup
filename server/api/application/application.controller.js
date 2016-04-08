'use strict'

const applicationService = require('./application.service')
const logger = require('../../config/logger')
const cronjobService = require('./cronjob.service')
const pmx = require('pmx')

exports.contact = function (req, res) {
  let data = req.body
  applicationService.emailContact(data, function (err, data) {
    if (err) {
      logger.info(err, err)
    }
  })
  res.status(200).json({})
}

exports.config = function (req, res) {
  applicationService.configView(function (err, data) {
    if (err) return res.status(404)
    return res.status(200).json(data)
  })
}

exports.cron = function (req, res) {
  cronjobService.run(function (err, data) {
    if (err) {
      pmx.notify(new Error('cronV3 Error: ' + JSON.stringify(err)))
      return res.status(500).json(err)
    }
    return res.status(200).json(data)
  })
}

exports.cronCompleteOrders = function (req, res) {
  cronjobService.runCompleteOrders(function (err, data) {
    if (err) {
      pmx.notify(new Error('cronCompleteOrdersV3 Error: ' + JSON.stringify(err)))
    }
    res.status(200).json(data)
  })
}
