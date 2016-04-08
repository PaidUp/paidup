'use strict'

const express = require('express')
const authService = require('../../auth/auth.service')
const controller = require('./order.controller')
const router = express.Router()

router.post('/create', authService.isAuthenticated(), controller.createOrder)

module.exports = router
