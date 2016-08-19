'use strict'

const express = require('express')
const router = express.Router()
const authService = require('../../auth/auth.service')
const controller = require('./account.controller')

router.get('/list', authService.isAuthenticated(), controller.listAccounts)
router.get('/list/:userId', authService.isAuthenticated(), controller.listAccounts)


module.exports = router
