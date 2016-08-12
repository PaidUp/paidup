'use strict'

var express = require('express')
var router = express.Router()
var authService = require('../../auth/auth.service')
var controller = require('./balance.controller')

router.get('/:destinationId/:transferId', authService.isAuthenticated(), controller.getBalance)
module.exports = router
