'use strict'

const logger = require('../../config/logger')
const PaidUpProductConnect = require('paidup-product-connect')
const config = require('../../config/environment')
const organizationService = require('./organization.service')
const paymentService = require('../payment/payment.service')
// var commerceEmailService = require('../commerce.email.service')
// var userService = require('../../user/user.service')

exports.organizationRequest = function (req, res) {
  PaidUpProductConnect.organizationRequest({
    baseUrl: config.connections.product.baseUrl,
    token: config.connections.product.token,
    organizationInfo: req.body.organizationInfo,
    userId: req.body.userId
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      return res.status(400).json(err)
    },
    success: function (organization) {
      req.body.organizationInfo._id = organization.body.organizationId
      organizationService.sendContactEmail(req.body.organizationInfo, function (err, send) {
        if (err) {
          logger.info(err)
        } else {
          return res.status(200).json(organization.body)
        }
      })
    }
  })
}

exports.organizationResponse = function (req, res) {
  const organizationId = req.params.id
  PaidUpProductConnect.organizationResponse({
    baseUrl: config.connections.product.baseUrl,
    token: config.connections.product.token,
    organizationId: organizationId
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      return res.status(400).json(err)
    },
    success: function (organization) {
      const stripeInfo = {email: organization.body.ownerEmail, country: organization.body.country}
      paymentService.createConnectAccount(stripeInfo, function (err, account) {
        if (err) return handleError(res, err)
        paymentService.addBankConnectAccount({ accountId: account.id, bankAccount: { country: organization.body.country, routingNumber: organization.body.aba, accountNumber: organization.body.dda } }, function (err, bank) {
          if (err) return handleError(res, err)
          const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.client.remoteAddress
          const legalEntity = {
            accountId: account.id,
            firstName: organization.body.ownerFirstName,
            lastName: organization.body.ownerLastName,
            day: new Date(organization.body.ownerDOB).getDay() + 1,
            month: new Date(organization.body.ownerDOB).getMonth() + 1,
            year: new Date(organization.body.ownerDOB).getFullYear(),
            type: config.payment.legalEntity.type,
            businessName: organization.body.businessName,
            last4: organization.body.ownerSSN.slice(-4),
            EIN: organization.body.EIN,
            line1: organization.body.Address,
            line2: organization.body.AddressLineTwo,
            city: organization.body.city || 'Austin',
            state: organization.body.state || 'Tx',
            postalCode: organization.body.zipCode,
            country: organization.body.country || 'US',
            personalIdNumber: organization.body.ownerSSN
          }
          paymentService.addToSCustomer({ accountId: account.id, ip: ip }, function (err, acceptedToS) {
            if (err) return handleError(res, err)
            paymentService.addLegalCustomer(legalEntity, function (err, acceptedLegal) {
              if (err) return handleError(res, err)
              const updateDrescriptor = {
                accountId: account.id,
                data: {
                  statement_descriptor: organization.body.ownerFirstName + ' ' + organization.body.ownerLastName
                }
              }
              paymentService.updateAccount(updateDrescriptor, function (err, descriptor) {
                if (err) return res.status(200).json({updateAccount: err})
                PaidUpProductConnect.organizationResponseUpdate({
                  baseUrl: config.connections.product.baseUrl,
                  token: config.connections.product.token,
                  organizationId: organizationId
                }).exec({
                  // An unexpected error occurred.
                  error: function (err) {
                    return handleError(res, err)
                  },
                  success: function (organization) {
                    return res.status(200).json(organization)
                  }
                })
              })
            })
          })
        })
      })
    }
  })
}

function handleError (res, err) {
  var httpErrorCode = 500

  if (err.name === 'ValidationError') {
    httpErrorCode = 400
  }
  logger.log('error', err)

  return res.status(httpErrorCode).json({ code: err.name, message: err.message, errors: err.errors })
}
