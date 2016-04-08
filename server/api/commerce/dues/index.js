'use strict'

const express = require('express')
const controller = require('./dues.controller')
const authService = require('../../auth/auth.service')
const router = express.Router()

router.post('/calculate', authService.isAuthenticated(), controller.calculateDues)

module.exports = router
