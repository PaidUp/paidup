'use strict'

var express = require('express')
var router = express.Router()
var authService = require('../../auth/auth.service')
var controller = require('./charge.controller')

router.get('/:destinationId', authService.isAuthenticated(), controller.getChargesList)
module.exports = router
