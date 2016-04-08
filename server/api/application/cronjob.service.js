'use strict'

const config = require('../../config/environment')
const fs = require('fs')
const paymentCronService = require('../payment/payment.cron.service')
const logger = require('../../config/logger')
const Moment = require('moment')
const pmx = require('pmx')

function endName (nameFile) {
  setTimeout(function () {
    try {
      fs.unlinkSync(config.cronjob.pathPidFile + nameFile)
    } catch (e) {
      logger.error(e)
    }
  }, 10)
}

function canStartGiveNameFile (nameFile) {
  if (fs.existsSync(config.cronjob.pathPidFile + nameFile)) {
    return false
  }
  return true
}

function startGiveName (nameFile) {
  fs.open(config.cronjob.pathPidFile + nameFile, 'wx', function (err, fd) {
    fs.close(fd, function (err) { })
  })
}

exports.run = function (cb) {
  let name = 'cron'
  if (canStartGiveNameFile(name)) {
    logger.log('info', Date() + ' running cron...')
    startGiveName(name)
    logger.log('info', 'paymentCronService.collectAccounts')
    paymentCronService.collectAccounts(function (err, data) {
      if (err) return cb(err)
      endName(name)
      return cb(null, data)
    })
  } else {
    return cb({ name: 'cron.pid is created' })
  }
}

exports.runCompleteOrders = function (cb) {
  let name = 'runCompleteOrders' + new Moment(new Date()).format('YYYYMMDD')
  if (canStartGiveNameFile(name)) {
    logger.log('info', Date() + ' running runCompleteOrders...')
    startGiveName(name)
    paymentCronService.collectAccountsComplete(function (err, results) {
      if (err) {
        pmx.notify(new Error('runCompleteOrders: ' + JSON.stringify(err)))
      }
      endName(name)
      return cb(null, results)
    })
  } else {
    pmx.notify(new Error('runCompleteOrders: pid is created: '))
    return cb(null, { name: name + '.pid is created' })
  }
}
