'use strict'

const express = require('express')
const router = express.Router()
const controller = require('./logger.controller.js')

router.post('/put', controller.logger)

module.exports = router
