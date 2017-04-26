'use strict'

const moment = require('moment')
const CommerceConnector = require('paidup-commerce-connect')
const config = require('../../config/environment')
const logger = require('../../config/logger')
var schedule = require('node-schedule');
var sg = require('sendgrid')(config.sendgrid.token);
//const nodemailer = require('nodemailer')
//const emailTemplates = require('email-templates')
//const transporter = nodemailer.createTransport(config.emailService)
//const PaidUpProductConnect = require('paidup-product-connect')

let notificationConfig = config.notifications.reminderChargeAccount;
let scheduleJob;
let isRunning = false;


function startNotificationChargeEmail() {
  logger.debug('start notification email');
  if (!isRunning) {
    isRunning = true;
    scheduleJob = schedule.scheduleJob(notificationConfig.cronFormat, function () {
      logger.debug('start schedule job: ' + new Date());
      logger.debug('start notification charge email');
      loadOrdersForNotifications(function (err, orders) {
        logger.debug('get orders for notification');
        if (err) {
          logger.error(err);
        }
        if (orders.length) {
          orders.forEach(function (order, idx, arr) {
            let to = {
              email: order.paymentsPlan[0].email,
              name: order.paymentsPlan[0].userInfo.userName,
            }
            let subject = order.paymentsPlan[0].productInfo.productName;
            let subs = buildSubstitutions(order)
            if (idx === 0) {
              emailHandler(to, subject, subs)
            }
            if (arr.length === idx + 1) {
              logger.debug("All emails was sended: " + new Date());
            }
          });
        } else {
          logger.debug('There aren´t orders for notification: ' + new Date());
        }
      });
    })
  }
}

function buildSubstitutions(order) {
  let futureCharges = []
  let processedCharges = []
  let today = new Date();
  let substitutions = {
    customerFirstName: order.paymentsPlan[0].userInfo.userName,
    orderId: order.orderId,
    orgName: order.paymentsPlan[0].productInfo.organizationName,
    productName: order.paymentsPlan[0].productInfo.productName,
    processedCharges: "",
    futureCharges: ""
  }
  order.paymentsPlan.forEach(function (pp) {
    let template = `
      <tr> 
        <td>${moment(pp.dateCharge).format('MM-DD-YYYY')}</td>
        <td>${pp.description}</td>
        <td>${pp.price}</td>
        <td>${pp.status}</td>
        <td>${pp.last4}</td>
      </tr>
    `
    if (pp.status === 'pending') {
      futureCharges.push(template)
    } else {
      processedCharges.push(template)
    }
  });
  let table = "<table width='100%'><tr><th>Date</th><th>Description</th><th>Price</th><th>Status</th><th>Account</th></tr>";
  if (processedCharges.length) {
    substitutions.processedCharges = table + processedCharges.join(" ") + "</table>"
  }
  if (futureCharges.length) {
    substitutions.futureCharges = table + futureCharges.join(" ") + "</table>"
  }
  return substitutions;
}

function loadOrdersForNotifications(cb) {
  let date = new Date();
  let numberOfDaysToAdd = notificationConfig.days;
  date.setDate(date.getDate() + numberOfDaysToAdd);
  getOrders(date.toISOString(), function (err, data) {
    if (err) {
      return cb(err);
    }
    cb(null, data);
  })
}

function getOrders(date, cb) {
  CommerceConnector.orderNotificationCharge({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    date: date
  }).exec({
    error: function (err) {
      return cb(err)
    },
    success: function (result) {
      return cb(null, result.body)
    }
  })
}

function emailHandler(to, subject, substitutions) {
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body:

    {
      "from": {
        "email": notificationConfig.from,
        "name": notificationConfig.name
      },
      "personalizations": [
        {
          "to": [
            {
              "email": to.email,
              "name": to.name
            }
          ],
          "subject": subject,
          "substitutions": {
            "-customerFirstName-": substitutions.customerFirstName,
            "-transactionDate-": substitutions.transactionDate,
            "-orderId-": substitutions.orderId,
            "-orgName-": substitutions.orgName,
            "-productName-": substitutions.productName,
            "-paymentPlanDesc-": substitutions.paymentPlanDesc,
            "-trxDesc-": substitutions.trxDesc,
            "-futureCharges-": substitutions.futureCharges,
            "-processedCharges-": substitutions.processedCharges
          }
        }
      ],
      "template_id": notificationConfig.template
    }
  });

  sg.API(request, function (error, response) {
    if (error) {
      console.log('Error response received');
    }
  });
}

function helperMethod() {
  var helper = require('sendgrid').mail

  let mail = new helper.Mail()
  let email = new helper.Email("felipe@getpaidup.com", "Felipe")
  mail.setFrom(email)

  mail.setSubject("Hello World from the SendGrid Node.js Library")

  let personalization = new helper.Personalization()
  email = new helper.Email("riclara@gmail.com", "Example User")
  personalization.addTo(email)

  personalization.setSubject("Hello World from the Personalized SendGrid Node.js Library")

  let substitution = new helper.Substitution("%name%", "Example User")
  personalization.addSubstitution(substitution)
  substitution = new helper.Substitution("%city%", "Denver")
  personalization.addSubstitution(substitution)

  mail.addPersonalization(personalization)

  let content = new helper.Content("text/plain", "some text here")
  mail.addContent(content)
  content = new helper.Content("text/html", "<html><body>some text here</body></html>")
  mail.addContent(content)

  mail.setTemplateId("439b6d66-4408-4ead-83de-5c83c2ee313a")
  return mail.toJSON()
}

exports.startNotificationChargeEmail = startNotificationChargeEmail
