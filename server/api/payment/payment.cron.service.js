'use strict'

const config = require('../../config/environment')
const paymentService = require('./payment.service')
const logger = require('../../config/logger')
const CommerceConnect = require('paidup-commerce-connect')
const pmx = require('pmx')
const Q = require('q')
// https://www.npmjs.com/package/q
// https://gist.github.com/cpdean/8659630

exports.collectAccounts = function (cb) {
  paymentSchedulev3(function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function paymentSchedulev3 (cb) {
  let params = {
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token
  }

  CommerceConnect.orderGetToCharge(params).exec({
    success: function (data) {
      if (data.body.orders.length > 0) {
        Promise.all(data.body.orders.map(function (order) {
          return capture(order).then(function (value) { return value })
        })).then(function (result) {
          logger.info('orderGetToCharge capture', result)
          return cb(null, {cron: result})
        }, function (reason) {
          logger.error('orderGetToCharge error capturev3', reason)
          return cb(reason)
        })
      } else {
        return cb(null, {cron: 'Done'})
      }
    },
    error: function (err) {
      logger.error('orderGetToCharge error ', err)
      pmx.notify('orderGetToCharge error ' + JSON.stringify(err))
      return cb(err)
    }
  })

  function capture (order) {
    let deferred = Q.defer()
    paymentService.capture(order, function (err, data) {
      if (err) {
        pmx.notify('Error capturev3: Order: ' + order.orderId + ', ScheduleId: ' + order.paymentsPlan[0]._id + ', Err:' + JSON.stringify(err))
        logger.error('capturev3 error ', err)
        err.orderId = order._id
        err.scheduleId = order.paymentsPlan[0]._id
        deferred.resolve(err)
      } else {
        deferred.resolve({_id: order._id, orderId: order.orderId, scheduleId: order.paymentsPlan[0]._id, err: data.err})
      }
    })
    return deferred.promise
  }
}

exports.collectAccountsComplete = function (cb) {
  let params = {
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token
  }
  CommerceConnect.orderToComplete(params).exec({
    success: function (data) {
      return cb(null, {orderCompleted: data.body.nModified})
    },
    error: function (err) {
      console.log('err', err)
      return cb(err)
    }
  })
}
