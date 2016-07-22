'use strict'

var express = require('express')
var router = express.Router()
var controller = require('./webhook.controller')

router.post('/', controller.webpost)
router.get('/', controller.webget)
router.post('/charge', controller.webgetpaymentcharge)

router.post('/charge/account/failed', controller.failed)
router.post('/charge/account/succeeded', controller.succeeded)
router.post('/charge/account/updated', controller.updated)

router.post('/charge/cc/captured', controller.ccaptured)
router.post('/charge/cc/failed', controller.cfailed)
router.post('/charge/cc/refunded', controller.crefunded)
router.post('/charge/cc/succeeded', controller.csucceeded)
router.post('/charge/cc/updated', controller.cupdated)

module.exports = router
