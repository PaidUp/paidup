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
  return cb(null, data)
}

exports.emailContact = emailContact
exports.configView = configView
