'use strict'

const express = require('express')
const tdAuthService = require('TDCore').authService
const config = require('../../../config/environment')
const authService = require('../auth.service')
const addressService = require('../../user/address/address.service')
const userService = require('../../user/user.service')

const router = express.Router()

router.post('/login', authService.isValidWsClient(), function (req, res, next) {
  tdAuthService.init(config.connections.user)
  tdAuthService.login(req.body, function (err, data) {
    if (err) return res.status(402).json(err)
    res.status(200).json(data)
  })
})

module.exports = router
