'use strict'

const moment = require('moment')
const CommerceConnector = require('paidup-commerce-connect')
const config = require('../../config/environment')
const logger = require('../../config/logger')
const schedule = require('node-schedule');
const mail = require('../../components/util/mail');

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
            let subs = buildSubstitutions(order, function(template, subs){
              mail.send(to, subject, subs, template)              
            })
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

function buildSubstitutions(order, cb) {
  let pendingCharges = [];
  let counter = 0;
  let nextPP = {};
  
  order.paymentsPlan.forEach(function (pp) {
    let template = `
      <tr> 
        <td>${moment(pp.dateCharge).format('MM-DD-YYYY')}</td>
        <td>${pp.description}</td>
        <td>$${pp.price.toFixed(2)}</td>
        <td>${pp.status}</td>
        <td>${pp.accountBrand} x-${pp.last4}</td>
      </tr>
    `
    if (pp.status === 'pending') {
      if(!counter){
        nextPP = pp;
        counter = counter + 1;
      } else {
        pendingCharges.push(template)
      }
    }
  });
  let substitutions = {
    '-invoiceId-': order.orderId,
    '-userFirstName-': order.paymentsPlan[0].userInfo.userName.split(' ')[0],
    '-beneficiaryFirstName-': order.paymentsPlan[0].customInfo.formData.athleteFirstName,
    '-beneficiaryLastName-': order.paymentsPlan[0].customInfo.formData.athleteLastName,
    '-orgName-': nextPP.productInfo.organizationName,
    '-productName-': order.paymentsPlan[0].productInfo.productName,
    '-trxAccount-': nextPP.last4,
    '-trxAccount-': nextPP.accountBrand + ' x-' + nextPP.last4,
    '-trxAmount-': '$' + nextPP.price.toFixed(2),
    '-trxDate-': moment(nextPP.dateCharge).format('MM-DD-YYYY'),
    '-trxDesc-': nextPP.description,
    '-orderId-': order.orderId,
    '-pendingCharges-': ""
  }

  let table = "<table width='100%'><tr><th>Date</th><th>Description</th><th>Price</th><th>Status</th><th>Account</th></tr>";
  if (pendingCharges.length) {
    substitutions['-pendingCharges-'] = table + pendingCharges.join(" ") + "</table>"    
    cb(notificationConfig.template.withFuturePayments, substitutions)
  } else {
    cb(notificationConfig.template.noFuturePayments, substitutions)
  }
}

function loadOrdersForNotifications(cb) {
  let gtDate = new Date();
  let ltDate = new Date();
  let numberOfDaysToAdd = notificationConfig.days;
  gtDate.setTime(gtDate.getTime() + (numberOfDaysToAdd - 1) * 86400000 );
  gtDate.setHours(23);
  gtDate.setMinutes(59);
  gtDate.setSeconds(59);
  
  ltDate.setTime(ltDate.getTime() + (numberOfDaysToAdd + 1) * 86400000 );
  ltDate.setHours(0);
  ltDate.setMinutes(0);
  ltDate.setSeconds(0);
  getOrders(gtDate.toISOString(), ltDate.toISOString(), function (err, data) {
    if (err) {
      return cb(err);
    }
    cb(null, data);
  })
}

function getOrders(gtDate, ltDate, cb) {
  CommerceConnector.orderNotificationCharge({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    gtDate: gtDate,
    ltDate: ltDate
  }).exec({
    error: function (err) {
      return cb(err)
    },
    success: function (result) {
      return cb(null, result.body)
    }
  })
}

exports.startNotificationChargeEmail = startNotificationChargeEmail
