'use strict'

const tdUserService = require('TDCore').userService
const config = require('../../../config/environment')

function create (data, cb) {
  tdUserService.init(config.connections.user)
  tdUserService.addressCreate(data, data.userId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function list (data, cb) {
  tdUserService.init(config.connections.user)
  tdUserService.addressList(data, data.userId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function load (data, cb) {
  tdUserService.init(config.connections.user)
  tdUserService.addressLoad(data.id, data.addressId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function update (data, cb) {
  tdUserService.init(config.connections.user)
  tdUserService.addressUpdate(data, data.userId, data.addressId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

exports.create = create
exports.list = list
exports.load = load
exports.update = update
