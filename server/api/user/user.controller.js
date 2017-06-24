'use strict'

const userService = require('./user.service')

exports.create = function (req, res) {
  userService.create(req.body, function (err, data) {
    if (err) return res.status(402).json(err)
    res.status(200).json(data)
  })
}

exports.createAll = function (req, res, next) {
  userService.createAll(req.body, function (err, data) {
    if (err) return res.status(402).json(err)
    res.status(200).json(data)
  })
}

exports.current = function (req, res, next) {
  userService.current(req.query, function (err, data) {
    if (err) return res.status(402).json(err)
    res.status(200).json(data)
  })
}

exports.update = function (req, res, next) {
  userService.update(req.body, function (err, data) {
    if (err) return res.status(402).json(err)
    res.status(200).json(data)
  })
}

exports.find = function (req, res, next) {
  userService.find(req.body, function (err, data) {
    if (err) return res.status(402).json(err)
    res.status(200).json(data)
  })
}

exports.sendWelcome = function (req, res, next) {
  // Disable temporarily because the user should not leave the CS page.
  // userService.sendEmailWelcome(req.body, function (err, data){
  // mix.panel.track("sendEmailWelcome", mix.mergeDataMixpanel(req.body, req.user._id))
  // if(err) return res.status(402).json(err)
  res.status(200).json({data: 'sendWelcome'})
  // })
}

exports.sendResetPassword = function (req, res, next) {
  userService.sendEmailResetPassword(req.body, function (err, data) {
    if (err) return res.status(402).json(err)
    res.status(200).json({data: 'sendResetPassword'})
  })
}

exports.createZendeskUser = function(req, res, next){
  userService.createZendeskUser(req.body, function (err, data) {
    if (err) return res.status(402).json(err)
    res.status(200).json(data)
  })
}

exports.addProduct = function (req, res) {
  userService.addProduct(req.body, function (err, data) {
    if (err) return res.status(402).json(err)
    res.status(200).json(data)
  })
}

exports.deleteProduct = function (req, res) {
  userService.deleteProduct(req.body, function (err, data) {
    if (err) return res.status(402).json(err)
    res.status(200).json(data)
  })
}

exports.getProducts = function (req, res) {
  userService.getProducts(req.params.email, function (err, data) {
    if (err) return res.status(402).json(err)
    res.status(200).json(data)
  })
}
