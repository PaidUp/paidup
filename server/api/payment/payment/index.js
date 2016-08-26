'use strict'

const express = require('express')
const router = express.Router()
const authService = require('../../auth/auth.service')
const controller = require('./payment.controller')

router.get('/:paymentId/account/:organizationId', authService.isAuthenticated(), controller.getDepositDetils)
router.get('/:paymentId/account/:organizationId/refund', authService.isAuthenticated(), controller.getDepositDetilsRefund)
module.exports = router
