'use strict'

const config = require('../../config/environment')
const nodemailer = require('nodemailer')
const emailTemplates = require('email-templates')
const Moment = require('moment')
const transporter = nodemailer.createTransport(config.emailService)

exports.sendNewOrderEmail = function (params, cb) {
  emailTemplates(config.emailTemplateRoot, function (err, template) {
    if (err) return cb(err)
    let emailVars = JSON.parse(JSON.stringify(config.emailVars))
    emailVars.orderId = params.orderId
    emailVars.paymentMethod = ''
    emailVars.last4Digits = params.last4
    emailVars.amount = params.amount
    emailVars.product = params.product
    emailVars.schedules = params.schedules
    emailVars.accountStatus = ''
    template('payment/checkout', emailVars, function (err, html, text) {
      if (err) return cb(err)
      let mailOptions = JSON.parse(JSON.stringify(config.emailOptions))
      mailOptions.html = html
      mailOptions.to = params.email
      mailOptions.subject = emailVars.prefix + 'New Order from ' + emailVars.companyName
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

exports.sendRetryEmail = function (userFirstName, email, accountLast4Digits, amount, daysToTry, cb) {
  let emailVars = JSON.parse(JSON.stringify(config.emailVars))
  emailVars.userFirstName = userFirstName
  emailVars.accountLast4Digits = accountLast4Digits
  emailVars.amount = parseFloat(amount).toFixed(2)
  emailVars.daysToTry = daysToTry
  emailTemplates(config.emailTemplateRoot, function (err, template) {
    if (err) return cb(err)

    template('payment/retry', emailVars, function (err, html, text) {
      if (err) return cb(err)
      let mailOptions = config.emailOptions
      mailOptions.to = email
      mailOptions.html = html
      mailOptions.subject = 'Payment notification: Payment failed. We will retry in a few days. '
      mailOptions.attachments = []
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return cb(err)
        } else {
          return cb(null, info)
        }
      })
    })
  })
}

exports.sendEmailReminderPaymentParents = function (user, nameTeam, schedule, value, period, card, cb) {
  let card4 = card.data[0].last4 || 'XXXX'
  emailTemplates(config.emailTemplateRoot, function (errTemplate, template) {
    if (errTemplate) return cb(errTemplate)
    let emailVars = JSON.parse(JSON.stringify(config.emailVars))
    emailVars.userFirstName = user[0].firstName
    emailVars.Last4Digits = card4
    emailVars.amount = parseFloat(schedule.price).toFixed(2)
    emailVars.datePaymentDue = new Moment(schedule.nextPaymentDue).format('dddd, MMMM Do YYYY')
    emailVars.teamName = nameTeam
    template('payment/laterChargePayment', emailVars, function (err, html, text) {
      if (err) return cb(err)
      let mailOptions = JSON.parse(JSON.stringify(config.emailOptions))
      mailOptions.html = html
      mailOptions.to = user[0].email
      mailOptions.subject = 'Heads Up: ' + nameTeam + ' Payment Coming Up In A Couple Of Days '
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

exports.sendProcessedEmailCreditCardv3 = function (data, cb) {
  let emailVars = JSON.parse(JSON.stringify(config.emailVars))
  emailVars.userFirstName = data.paymentsPlan[0].userInfo.userName
  emailVars.amount = parseFloat(data.paymentsPlan[0].price).toFixed(2)
  emailVars.accountLast4Digits = data.paymentsPlan[0].last4
  emailVars.team = data.paymentsPlan[0].productInfo.productName
  emailTemplates(config.emailTemplateRoot, function (err, template) {
    if (err) return cb(err)
    template('payment/processed', emailVars, function (err, html, text) {
      if (err) return cb(err)
      let mailOptions = JSON.parse(JSON.stringify(config.emailOptions))
      mailOptions.to = data.paymentsPlan[0].email
      mailOptions.html = html
      mailOptions.subject = 'Payment Processed Successfully – ' + data.paymentsPlan[0].productInfo.productName
      mailOptions.attachments = []
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return cb(err)
        } else {
          return cb(null, info)
        }
      })
    })
  })
}

exports.sendFinalEmailCreditCardv3 = function (data, cb) {
  let emailVars = JSON.parse(JSON.stringify(config.emailVars))
  emailVars.userFirstName = data.paymentsPlan[0].userInfo.userName
  emailVars.amount = parseFloat(data.paymentsPlan[0].price).toFixed(2)
  emailVars.accountLast4Digits = data.paymentsPlan[0].last4
  emailVars.team = data.paymentsPlan[0].productInfo.productName
  emailTemplates(config.emailTemplateRoot, function (err, template) {
    if (err) return cb(err)
    template('payment/final', emailVars, function (err, html, text) {
      if (err) return cb(err)
      let mailOptions = JSON.parse(JSON.stringify(config.emailOptions))
      mailOptions.to = data.paymentsPlan[0].email
      mailOptions.html = html
      mailOptions.subject = 'Oh Oh – Problem With Your Payment – ' + data.paymentsPlan[0].productInfo.productName
      mailOptions.attachments = []
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return cb(err)
        } else {
          return cb(null, info)
        }
      })
    })
  })
}
