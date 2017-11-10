'use strict'

const express = require('express')
const authService = require('../../auth/auth.service')
const controller = require('./order.controller')
const router = express.Router()

router.post('/create', authService.isAuthenticated(), controller.createOrder)
router.get('/recent/:userId/:limit', authService.isAuthenticated(), controller.orderPaymentRecent)
router.get('/next/:userId/:limit', authService.isAuthenticated(), controller.orderPaymentNext)
router.get('/active/:userId/:limit', authService.isAuthenticated(), controller.orderPaymentActive)

router.get('/organization/:organizationId/:limit/:sort/:from/:to', authService.isAuthenticated(), controller.orderGetOrganization)
router.get('/:userId/:limit/:sort', authService.isAuthenticated(), controller.orderGet)
router.post('/cancel', authService.isAuthenticated(), controller.orderCancel)
router.post('/activate', authService.isAuthenticated(), controller.orderActivate)
router.post('/payment/remove', authService.isAuthenticated(), controller.removePaymentPlan)

router.post('/search', authService.isAuthenticated(), controller.orderSearch);
router.post('/history', authService.isAuthenticated(), controller.orderHistory);
router.post('/transactions', authService.isAuthenticated(), controller.orderTransactions);
router.get('/transactions', authService.isAuthenticated(), controller.orderTransactions);
router.post('/edit', authService.isAuthenticated(), controller.editOrder);
router.post('/edit-all', authService.isAuthenticated(), controller.editAllPaymentsPlanByOrder);
router.post('/add', authService.isAuthenticated(), controller.addPaymentPlan);


module.exports = router
