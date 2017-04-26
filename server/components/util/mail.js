'use strict'

const config = require('../../config/environment')
var sg = require('sendgrid')(config.sendgrid.token);
let notificationConfig = config.notifications.reminderChargeAccount;

function send(to, subject, substitutions, template) {
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
      "template_id": template
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

exports.send = send;