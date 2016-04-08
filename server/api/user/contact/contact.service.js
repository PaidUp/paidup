'use strict'

const tdUserService = require('TDCore').userService
const config = require('../../../config/environment')

function create (data, cb) {
  tdUserService.init(config.connections.user)
  tdUserService.contactCreate(data, data.userId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function list (data, cb) {
  tdUserService.init(config.connections.user)
  tdUserService.contactList(data, data.userId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function load (data, cb) {
  tdUserService.init(config.connections.user)
  tdUserService.contactLoad(data.id, data.contactId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function update (data, cb) {
  tdUserService.init(config.connections.user)
  tdUserService.contactUpdate(data, data.userId, data.contactId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

exports.create = create
exports.list = list
exports.load = load
exports.update = update
