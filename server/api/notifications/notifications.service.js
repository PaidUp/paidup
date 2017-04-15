'use strict'

const CommerceConnector = require('paidup-commerce-connect')
const config = require('../../config/environment')
const logger = require('../../config/logger')
var schedule = require('node-schedule');
var sg = require('sendgrid')('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');
//const nodemailer = require('nodemailer')
//const emailTemplates = require('email-templates')
//const transporter = nodemailer.createTransport(config.emailService)
//const PaidUpProductConnect = require('paidup-product-connect')

let notificationConfig = config.notifications.reminderChargeAccount;
let scheduleJob;
let isRunning;


exports.startNotificationChargeEmail = function (params, cb) {
  logger.debug('into startNotificationChargeEmail');
  emailHandler();
  //console.log(JSON.stringify(kitchenSink()) )
  isRunning = true;


}

function loadOrdersForNotifications(param, cb) {
  scheduleJob = schedule.scheduleJob('*/59 * * * * *', function () {
    let date = new Date();
    let numberOfDaysToAdd = notificationConfig.days;
    date.setDate(date.getDate() + numberOfDaysToAdd);
    getOrders(date.toISOString(), function (data, err) {
      if (err) {
        logger.error(err)
      }

      //logger.debug(data)
    })
  });

}

function getOrders(date, cb) {
  logger.debug('get orders to notify')
  CommerceConnector.orderNotificationCharge({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    date: date
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      return cb(err)
    },
    // OK.
    success: function (result) {
      return cb(null, result.body)
    }
  })


}

function emailHandler() {
  var request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body:


    {
      "from": {
        "email": "felipe@test.com",
        "name": "Felipe"
      },
      "personalizations": [
        {
          "to": [
            {
              "email": "riclara@gmail.com",
              "name": "Example User"
            }
          ],
          "subject": "Hello World from the Personalized SendGrid Node.js Library",
          "substitutions": {
            "-customerFirstName-": "<h1>Ricardo</h1>",
            "%city%": "Denver"
          }
        }
      ],
      "subject": "Hello World from the SendGrid Node.js Library",
     
      "template_id": "624c5e45-e88a-4a13-894f-1b989d44f029"
    }



    
  });

  sg.API(request, function (error, response) {
    if (error) {
      console.log('Error response received');
    }
    console.log(response.statusCode);
    console.log(response.body);
    console.log(response.headers);
  });
}

function isValidEmail(mail) {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(mail)
}

function kitchenSink() {
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
