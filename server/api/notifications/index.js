'use strict'

var express = require('express')
var authService = require('../auth/auth.service')
var controller = require('./charge_notifications.controller')

var router = express.Router()

router.post('/charge/reminder/start', authService.isAuthenticated(), controller.start)
router.get('/charge/reminder/stop', authService.isAuthenticated(), controller.stop)
router.get('/charge/reminder/status', authService.isAuthenticated(), controller.status)

module.exports = router
