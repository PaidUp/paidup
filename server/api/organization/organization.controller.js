'use strict'

const logger = require('../../config/logger')
const PaidUpProductConnect = require('paidup-product-connect')
const config = require('../../config/environment')
const organizationService = require('./organization.service')
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
  console.log('req.params', req.params)
  return res.status(200).json({response: true})
/* var providerId = req.params.id
commerceService.providerResponse(providerId, 'pending', function (err, provider) {
  if (err) {
    return handleError(res, err)
  }
  if (!provider) {
    return res.status(200).json({})
  }
  var stripeInfo = {
    email: provider.ownerEmail,
    country: provider.country
  }
  paymentService.createConnectAccount(stripeInfo, function (err, account) {
    if (err) {
      //return handleError(res, err)
      return res.status(200).json({})
    }
    paymentService.addBankConnectAccount({ accountId: account.id, bankAccount: { country: provider.country, routingNumber: provider.aba, accountNumber: provider.dda } }, function (err, bank) {
      if (err) {
        //return handleError(res, err)
        return res.status(401).json({})
      }
      var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.client.remoteAddress
      var legalEntity = {
        accountId: account.id,
        firstName: provider.ownerFirstName,
        lastName: provider.ownerLastName,
        day: provider.ownerDOB.getDay() + 1,
        month: provider.ownerDOB.getMonth() + 1,
        year: provider.ownerDOB.getFullYear(),
        type: config.payment.legalEntity.type,
        businessName: provider.businessName,
        last4: provider.ownerSSN.slice(-4),
        EIN: provider.EIN,
        line1: provider.Address,
        line2: provider.AddressLineTwo,
        city: provider.city || 'Austin',
        state: provider.state || 'Tx',
        postalCode: provider.zipCode,
        country: provider.country || 'US',
        personalIdNumber: provider.ownerSSN
      }
      paymentService.addToSCustomer({ accountId: account.id, ip: ip }, function (err, acceptedToS) {
        if (err) {
          //return handleError(res, err)
          return res.status(401).json({})
        }
        paymentService.addLegalCustomer(legalEntity, function (err, acceptedLegal) {
          var updateDrescriptor = {
            accountId: account.id,
            data: {
              statement_descriptor: provider.ownerFirstName + ' ' + provider.ownerLastName
            }
          }
          paymentService.updateAccount(updateDrescriptor, function (err, descriptor) {
            if (err) {
              //return handleError(res, err)
              return res.status(401).json({})
            }

            if (err) {
              //return handleError(res, err)
              return res.status(401).json({})
            }
            var productTeam = {
              type: config.commerce.products.defaultValue.type,
              set: config.commerce.products.defaultValue.set,
              sku: provider.ownerId,
              data: {
                name: provider.teamName,
                websites: [config.commerce.products.defaultValue.websites],
                shortDescription: provider.businessName,
                description: '',
                status: config.commerce.products.defaultValue.status,
                price: config.commerce.products.defaultValue.price,
                taxClassId: config.commerce.products.defaultValue.taxClassId,
                urlKey: config.commerce.products.defaultValue.urlKey,
                urlPath: config.commerce.products.defaultValue.urlPath,
                visibility: config.commerce.products.defaultValue.visibility,
                categories: [config.commerce.category.teams],
                categoryIds: [config.commerce.category.teams],
                balancedCustomerId: account.id,
                tdPaymentId: account.id
              }
            }
            catalogService.catalogCreate(productTeam, function (err, teamId) {
              if (err) {
                //return handleError(res, err)
                return res.status(402).json({})
              }
              commerceService.providerResponseUpdate(providerId, { verify: 'done', aba: '', dda: '', ownerSSN: '' }, function (err, providerData) {
                if (err) {
                  //return handleError(res, err)
                  return res.status(403).json({})
                }
                userService.find({ _id: provider.ownerId }, function (err, users) {
                  if (err) return handleError(res, err)
                  var user = users[0]
                  user.meta.providerStatus = 'done'
                  user.meta.productRelated.push(teamId)
                  userService.save(user, function (err, data) {
                    if (err) {
                      return handleError(res, err)
                    }
                    return res.status(200).json({})
                  })
                })
              })
            })
          })
        })
      })
    })
  })
  //return res.redirect('/')
})
*/
}

function handleError (res, err) {
  var httpErrorCode = 500
  var errors = []

  if (err.name === 'ValidationError') {
    httpErrorCode = 400
  }
  logger.log('error', err)

  return res.status(httpErrorCode).json({ code: err.name, message: err.message, errors: err.errors })
}
