'use strict'

const express = require('express')
const controller = require('./media.controller')
const config = require('../../config/environment')
const router = express.Router()


router.get('/image/magento', controller.getMagentoImage)


module.exports = router
