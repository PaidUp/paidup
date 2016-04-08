'use strict'

const express = require('express')
const router = express.Router()
const authService = require('../../auth/auth.service')
const controller = require('./card.controller')

router.post('/associate', authService.isAuthenticated(), controller.associate)
router.get('/list/user/:userId', authService.isAuthenticated(), controller.listCards)
router.get('/list', authService.isAuthenticated(), controller.listCards)
router.get('/:id', authService.isAuthenticated(), controller.getCard)

module.exports = router
