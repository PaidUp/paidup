'use strict'

const tdUserService = require('TDCore').userService
const config = require('../../config/environment')
const nodemailer = require('nodemailer')
const emailTemplates = require('email-templates')
const transporter = nodemailer.createTransport(config.emailService)
const zendesk = require('paidup-zendesk-connect')

function create(data, cb) {
  console.log('data: ', data);

  tdUserService.init(config.connections.user)
  tdUserService.create(data, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function createAll(data, cb) {
  tdUserService.init(config.connections.user)
  tdUserService.createAll(data, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function current(data, cb) {
  tdUserService.init(config.connections.user)
  tdUserService.current(data.token, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function update(data, cb) {
  tdUserService.init(config.connections.user)
  let userId = data.parentId ? data.parentId : data.userId
  tdUserService.update(data, userId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function updateProductsSuggested(userId, productsSuggested, cb) {
  tdUserService.init(config.connections.user)
  tdUserService.updateProductsSuggested(userId, productsSuggested, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function find(filter, cb) {
  tdUserService.init(config.connections.user)
  tdUserService.find(filter, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function save(data, cb) {
  tdUserService.init(config.connections.user)
  tdUserService.save(data, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function sendEmailWelcome(data, cb) {
  emailTemplates(config.emailTemplateRoot, function (err, template) {
    if (err) return cb(err)
    let emailVars = config.emailVars
    emailVars.fullName = data.user.firstName + ' ' + data.user.lastName // user.getFullName()
    emailVars.token = data.token
    template('auth/welcome', emailVars, function (err, html, text) {
      if (err) return cb(err)
      let mailOptions = config.emailOptionsAlerts
      mailOptions.to = data.user.email
      mailOptions.html = html
      mailOptions.subject = emailVars.prefix + 'Welcome to ' + emailVars.companyName
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


function sendEmailResetPassword(data, cb) {
  emailTemplates(config.emailTemplateRoot, function (err, template) {
    if (err) return cb(err)
    let emailVars = config.emailVars
    emailVars.fullName = data.user.firstName + ' ' + data.user.lastName // user.getFullName()
    emailVars.token = data.token
    template('auth/reset', emailVars, function (err, html, text) {
      if (err) return cb(err)
      let mailOptions = config.emailOptionsAlerts
      mailOptions.to = data.user.email
      mailOptions.html = html
      mailOptions.subject = emailVars.prefix + 'Reset Password ' + emailVars.companyName
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

function createZendeskUser(params, cb) {
  zendesk.userCreate({
    username: params.username,
    token: params.token,
    subdomain: params.subdomain,
    email: params.email,
    fullName: params.fullName,
    phone: params.phone,
  }).exec({
    error: function (err) {
      cb(err);
    },
    success: function (result) {
      cb(null, result);
    },
  });
}

exports.create = create
exports.createAll = createAll
exports.current = current
exports.update = update
exports.find = find
exports.save = save
exports.sendEmailWelcome = sendEmailWelcome
exports.sendEmailResetPassword = sendEmailResetPassword
exports.updateProductsSuggested = updateProductsSuggested
exports.createZendeskUser = createZendeskUser
