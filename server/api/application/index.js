'use strict'

const express = require('express')
const controller = require('./application.controller')
const config = require('../../config/environment')
const router = express.Router()
const auth = require('TDCore').authCoreService

router.post('/contact', controller.contact)
router.get('/config', controller.config)
router.get('/cron', auth.isAuthenticatedServer(config.connections.me.token), controller.cron)
router.get('/cron/order/complete', auth.isAuthenticatedServer(config.connections.me.token), controller.cronCompleteOrders)

module.exports = router
