'use strict'

const express = require('express')
const router = express.Router()
const authService = require('../../auth/auth.service')
const controller = require('./transfer.controller')
const permissionPrefix = "payment/transfer";

const getTransfersPath = "/:destinationId/from/:from/to/:to";
router.get(getTransfersPath, authService.isAuthenticated(permissionPrefix + getTransfersPath), controller.getTransfers)
router.get('/retrieve/:transferId', authService.isAuthenticated(), controller.retrieveTransfer)
module.exports = router
