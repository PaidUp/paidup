'use strict'

const express = require('express')
const router = express.Router()

router.use('/cart', require('./cart/index'))
router.use('/catalog', require('./catalog/index'))
router.use('/order', require('./order/index'))
// router.use('/transaction', require('./transaction/index'))
// router.use('/provider', require('./provider/index'))
// router.use('/dues', require('./dues/index'))

module.exports = router
