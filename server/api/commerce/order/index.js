'use strict'

const express = require('express')
const authService = require('../../auth/auth.service')
const controller = require('./order.controller')
const router = express.Router()

router.post('/create', authService.isAuthenticated(), controller.createOrder)
router.get('/recent/:userId/:limit', authService.isAuthenticated(), controller.orderPaymentRecent)

module.exports = router
