'use strict'

const express = require('express')
const router = express.Router()
const authService = require('../../auth/auth.service')
const controller = require('./transfer.controller')

router.get('/:destinationId', authService.isAuthenticated(), controller.getTransfers)
module.exports = router
