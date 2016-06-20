'use strict'

var express = require('express')
var router = express.Router()
var authService = require('../../auth/auth.service')
var controller = require('./transfer.controller')

router.get('/:destinationId', authService.isAuthenticated(), controller.getTransfers)
module.exports = router
