'use strict'

const express = require('express')
const tdAuthService = require('TDCore').authService
const config = require('../../../config/environment')
const authService = require('../auth.service')

const router = express.Router()

router.post('/:thirdparty/login', authService.isValidWsClient(), function (req, res, next) {
  tdAuthService.init(config.connections.user)
  tdAuthService.login(req.body, function (err, data) {
    if (err) res.status(402).json(err)
    res.status(200).json(data)
  })
})

module.exports = router
