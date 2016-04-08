'use strict'

const express = require('express')
const tdAuthService = require('TDCore').authService
const config = require('../../../config/environment')

const router = express.Router()

router.post('/', function (req, res, next) {
  tdAuthService.init(config.connections.user)
  tdAuthService.facebook(req.body, function (err, data) {
    if (err) res.status(402).json(err)
    res.status(200).json(data)
  })
})

module.exports = router
