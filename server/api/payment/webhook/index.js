'use strict'

var express = require('express')
var router = express.Router()
var controller = require('./webhook.controller')

router.post('/', controller.webpost)
router.get('/', controller.webget)
router.post('/charge', controller.webgetpaymentcharge)

module.exports = router
