'use strict'

var express = require('express')
var authService = require('../auth/auth.service')
var controller = require('./organization.controller')

var router = express.Router()

router.post('/request', authService.isAuthenticated(), controller.organizationRequest)
router.get('/response/:id', controller.organizationResponse)

module.exports = router
