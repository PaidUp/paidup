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
            let subs = buildSubstitutions(order)
            let template = notificationConfig.template
            if (idx === 0) {
              mail.send(to, subject, subs, template)
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

exports.startNotificationChargeEmail = startNotificationChargeEmail
