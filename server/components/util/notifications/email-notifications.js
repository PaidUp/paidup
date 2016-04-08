'use strict'

const config = require('../../../config/environment')
const nodemailer = require('nodemailer')
const emailTemplates = require('email-templates')
const transporter = nodemailer.createTransport(config.emailService)

exports.sendNotification = function (subject, jsonMessage, cb) {
  try {
    let email = config.emailContacts.admin
    emailTemplates(config.emailTemplateRoot, function (err, template) {
      if (err) return cb(err)
      let emailVars = config.emailVars
      let arrMsj = []
      for (let key in jsonMessage) {
        arrMsj.push(key + ': ' + jsonMessage[key])
      }
      emailVars.arrMsj = arrMsj
      template('notifications', emailVars, function (err, html, text) {
        if (err) return cb(err)
        let mailOptions = config.emailOptionsAlerts
        mailOptions.html = html
        mailOptions.to = email
        mailOptions.subject = emailVars.prefix + subject + emailVars.companyName
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
  } catch (e) {
    return cb(e, null)
  }
}
