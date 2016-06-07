'use strict'

const config = require('../../config/environment')
const nodemailer = require('nodemailer')
const emailTemplates = require('email-templates')
const transporter = nodemailer.createTransport(config.emailService)
// const PaidUpProductConnect = require('paidup-product-connect')

exports.sendContactEmail = function sendContactEmail (dataOrganization, cb) {
  if (!isValidEmail(dataOrganization.ownerEmail)) {
    return cb('Email is not valid')
  }
  emailTemplates(config.emailTemplateRoot, function (err, template) {
    if (err) return cb(err)
    let emailVars = config.emailVars
    emailVars.email = dataOrganization.ownerEmail
    emailVars.ownerName = dataOrganization.businessName
    emailVars.teamName = dataOrganization.teamName
    emailVars.organization = dataOrganization
    template('product/organization', emailVars, function (err, html, text) {
      if (err) return cb(err)
      let mailOptions = config.emailOptionsAlerts
      mailOptions.to = config.emailContacts.admin
      mailOptions.html = html
      mailOptions.subject = emailVars.prefix + 'Message to ' + emailVars.companyName
      mailOptions.baseUrl = emailVars.baseUrl
      mailOptions.attachments = []
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return cb(error)
        } else {
          return cb(null, info)
        }
      })
    })
  })
}

exports.getOrganization = function getOrganization (organizationId, cb) {
  // PaidUpProductConnect.//()
  return cb(null, true)
}

function isValidEmail (mail) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail)
}
