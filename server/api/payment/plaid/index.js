'use strict'

const express = require('express')
const router = express.Router()
const authService = require('../../auth/auth.service')
const controller = require('./plaid.controller')

router.post('/authenticate', authService.isAuthenticated(), controller.authenticate)
module.exports = router
