'use strict'

const express = require('express')
const controller = require('./reports.controller')
const authService = require('../auth/auth.service')
const router = express.Router()

router.post('/revenue/projection', authService.isAuthenticated(), controller.revenueProjection)
router.post('/revenue', authService.isAuthenticated(), controller.revenue)

module.exports = router
