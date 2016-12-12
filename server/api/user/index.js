'use strict'

const express = require('express')
const controller = require('./user.controller')
const authService = require('../auth/auth.service')

const router = express.Router()

router.post('/create', controller.create)
router.post('/zendesk/create', controller.createZendeskUser)
router.post('/new', authService.isValidWsClient(), controller.createAll)
router.get('/current', authService.isAuthenticated(), controller.current)
router.post('/update', authService.isAuthenticated(), controller.update)
router.post('/:userId/update/products', authService.isAuthenticated(), controller.updateProductsSuggested)
router.post('/email/sendWelcome', controller.sendWelcome)
router.post('/email/sendResetPassword', controller.sendResetPassword)

router.use('/contact', require('./contact/index'))
router.use('/address', require('./address/index'))
router.use('/relation', require('./relation/index'))

router.post('/', authService.isAuthenticated(), controller.find)
module.exports = router
