'use strict'

const express = require('express')
const controller = require('./catalog.controller')
const authService = require('../../auth/auth.service')
const router = express.Router()

router.get('/category/:categoryId', authService.isAuthenticated(), controller.list)
router.get('/categories', authService.isAuthenticated(), controller.getCategories)
router.get('/grouped/product/:productId', authService.isAuthenticated(), controller.groupedProducts)
router.get('/product/:productId', authService.isAuthenticated(), controller.catalogInfo)
router.get('/product/fm/:productId', authService.isAuthenticated(), controller.getProduct)

module.exports = router
