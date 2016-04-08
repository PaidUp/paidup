'use strict'

const config = require('../../config/environment')
const nodemailer = require('nodemailer')
const emailTemplates = require('email-templates')
const transporter = nodemailer.createTransport(config.emailService)

exports.sendContactEmail = function (dataContact, cb) {
  if (!isValidEmail(dataContact.email)) {
    return cb('Email is not valid')
  }

  emailTemplates(config.emailTemplateRoot, function (err, template) {
    if (err) return cb(err)
    let emailVars = config.emailVars
    emailVars.email = dataContact.email
    emailVars.subject = emailVars.prefix + dataContact.subject
    emailVars.content = dataContact.content
    template('application/contact', emailVars, function (err, html, text) {
      if (err) return cb(err)
      let mailOptions = config.emailOptions
      mailOptions.to = config.emailContacts.contact
      mailOptions.html = html
      mailOptions.subject = 'Message to ' + emailVars.companyName
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

function isValidEmail (mail) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail)
}
