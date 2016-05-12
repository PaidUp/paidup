'use strict'

const express = require('express')
const authService = require('../../auth/auth.service')
const controller = require('./order.controller')
const router = express.Router()

router.post('/create', authService.isAuthenticated(), controller.createOrder)
router.get('/recent/:userId/:limit', authService.isAuthenticated(), controller.orderPaymentRecent)
router.get('/next/:userId/:limit', authService.isAuthenticated(), controller.orderPaymentNext)
router.get('/active/:userId/:limit', authService.isAuthenticated(), controller.orderPaymentActive)

router.get('/organization/:organizationId/:limit/:sort', authService.isAuthenticated(), controller.orderGet)
router.get('/:userId/:limit/:sort', authService.isAuthenticated(), controller.orderGet)


module.exports = router
