'use strict'

const express = require('express')
const router = express.Router()
const authService = require('../../auth/auth.service')
const controller = require('./plaid.controller')

router.post('/authenticate', authService.isAuthenticated(), controller.authenticate)
router.get('/listBanks', authService.isAuthenticated(), controller.listBanks)
module.exports = router
