'use strict'

const applicationEmailService = require('./application.email.service')
const config = require('../../config/environment')

function emailContact (dataContact, cb) {
  if (!dataContact.email || !dataContact.subject || !dataContact.content) {
    return cb('data contact is missing')
  }

  applicationEmailService.sendContactEmail(dataContact, function (err, data) {
    if (err) return cb(err)
    return cb(err, data)
  })
}

function configView (cb) {
  let data = {}
  data.marketplace = config.balanced.marketplace
  data.stripeApiPublic = config.stripe.apiPublic
  data.mixpanelApiKey = config.mixpanel.apiKey
  data.plaidEnv = config.plaid.env
  data.plaidClientName = config.plaid.clientName
  data.plaidKey = config.plaid.key
  data.plaidProduct = config.plaid.product
  return cb(null, data)
}

exports.emailContact = emailContact
exports.configView = configView
