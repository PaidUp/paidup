'use strict'
const contactService = require('./contact.service')

exports.create = function (req, res, next) {
  contactService.create(req.body, function (err, data) {
    if (err) res.status(402).json(err)
    res.status(200).json(data)
  })
}

exports.list = function (req, res, next) {
  let user = { userId: req.params.id }
  contactService.list(user, function (err, data) {
    if (err) res.status(402).json(err)
    res.status(200).json(data)
  })
}

exports.load = function (req, res, next) {
  contactService.load(req.params, function (err, data) {
    if (err) res.status(402).json(err)
    res.status(200).json(data)
  })
}

exports.update = function (req, res, next) {
  contactService.update(req.body, function (err, data) {
    if (err) res.status(402).json(err)
    res.status(200).json(data)
  })
}
