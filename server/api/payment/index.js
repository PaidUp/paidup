'use strict'

const express = require('express')
const router = express.Router()

router.use('/card', require('./card/index'))
// router.use('/customer', require('./customer/index'))
// router.use('/webhook', require('./webhook/index'))

module.exports = router
