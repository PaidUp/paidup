'use strict'

const express = require('express')
const router = express.Router()
const authService = require('../../auth/auth.service')
const controller = require('./method.controller')

router.delete('/:accountId', authService.isAuthenticated(), controller.remove)

module.exports = router