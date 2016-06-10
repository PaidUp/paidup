'use strict'
const addressService = require('./address.service')

exports.create = function (req, res, next) {
  addressService.create(req.body, function (err, data) {
    if (err) res.status(402).json(err)
    res.status(200).json(data)
  })
}

exports.list = function (req, res, next) {
  let user = { userId: req.params.id }
  addressService.list(user, function (err, data) {
    if (err) res.status(402).json(err)
    res.status(200).json(data)
  })
}

exports.load = function (req, res, next) {
  addressService.load(req.params, function (err, data) {
    if (err) res.status(402).json(err)
    res.status(200).json(data)
  })
}

exports.update = function (req, res, next) {
  req.body.userId = req.params.id
  addressService.update(req.body, function (err, data) {
    if (err) res.status(402).json(err)
    res.status(200).json(data)
  })
}
