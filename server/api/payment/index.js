'use strict'

const express = require('express')
const router = express.Router()

router.use('/card', require('./card/index'))
router.use('/customer', require('./customer/index'))
router.use('/webhook', require('./webhook/index'))
router.use('/transfer', require('./transfer/index'))
router.use('/balance', require('./balance/index'))
router.use('/charge', require('./charge/index'))

module.exports = router
