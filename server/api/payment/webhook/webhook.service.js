'use strict'
const config = require('../../../config/environment/index')
const nodemailer = require('nodemailer')
const emailTemplates = require('email-templates')
const transporter = nodemailer.createTransport(config.emailService)

exports.sendEmail = function (data, title, cb) {
  emailTemplates(config.emailTemplateRoot, function (err, template) {
    if (err) return cb(err)
    let emailVars = config.emailVars
    emailVars.subject = emailVars.prefix + 'Stripe webhook'
    emailVars.content = JSON.stringify(data) || 'no data'
    template('payment/webhook', emailVars, function (err, html, text) {
      if (err) return cb(err)
      let mailOptions = config.emailOptionsAlerts
      mailOptions.to = config.emailContacts.admin
      mailOptions.html = html
      mailOptions.subject = emailVars.prefix + title + ' Stripe webhook ' + emailVars.companyName
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
