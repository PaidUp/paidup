'use strict'

const config = require('../../config/environment')
const userService = require('../user/user.service')
const logger = require('../../config/logger')
const paymentEmailService = require('./payment.email.service')
const tdPaymentService = require('TDCore').paymentService
const CommerceConnect = require('paidup-commerce-connect')
const MAX_SIZE_META_STRIPE = config.stripe.maxSizeMeta
const zendesk = require('paidup-zendesk-connect')
const connector = require('../../db/connector');
const collectionName = config.mongo.options.prefix + 'properties';
const mail = require('../../components/util/mail');
const commerceService = require('../commerce/order/order.service');
const moment = require('moment')



function createCustomer(user, cb) {
  tdPaymentService.init(config.connections.payment)
  let customer = {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    id: user._id
  }
  tdPaymentService.createCustomer(customer, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function updateCustomer(dataCustomer, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.updateCustomer(dataCustomer, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function fetchCustomer(customerId, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.fetchCustomer(customerId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function createCard(cardDetails, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.createCard(cardDetails, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function associateCard(customerId, cardId, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.associateCard({ customerId: customerId, cardId: cardId }, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function createOrder(providerId, description, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.createOrder({ merchantCustomerId: providerId, description: description }, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function debitCardv2(cardId, amount, description, appearsOnStatementAs, customerId, providerId, fee, metaPayment, statementDescriptor, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.debitCardv2({
    cardId: cardId, amount: amount, description: description,
    appearsOnStatementAs: appearsOnStatementAs, customerId: customerId,
    providerId: providerId, fee: fee, meta: metaPayment, statementDescriptor: statementDescriptor
  }, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function listCards(customerId, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.listCards(customerId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function updateOrderDescription(orderId, description, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.updateOrderDescription({ orderId: orderId, description: description }, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

/**
 * Prepare user for Balanced Payments
 * @param user
 * @param cb
 */
function prepareUser(user, cb) {
  if (user.meta.TDPaymentId === '') {
    createCustomer(user, function (err, data) {
      if (err) return cb(err)
      user.meta.TDPaymentId = data.id
      userService.save(user, function (err, data) {
        if (err) return cb(err)
        return cb(null, data)
      })
    })
  } else {
    return cb(null, user)
  }
}

function fetchCard(customerId, cardId, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.fetchCard(customerId, cardId, function (err, creditCard) {
    if (err) return cb(err)
    return cb(null, creditCard)
  })
}

function fetchAccount(customerId, tokenId, cb) {
  tdPaymentService.init(config.connections.payment)
  if (tokenId.indexOf('ba') >= 0) {
    tdPaymentService.fetchBank(customerId, tokenId, function (err, bankAccount) {
      if (err) return cb(err)
      return cb(null, bankAccount)
    })
  } else {
    tdPaymentService.fetchCard(customerId, tokenId, function (err, creditCard) {
      if (err) return cb(err)
      return cb(null, creditCard)
    })
  }
}

function getVisibleBeneficiaryData(info) {
  let ret = info.formTemplate.reduce(function (actual, obj) {
    if (obj.displayed) {
      return actual + ' ' + info.formData[obj.model]
    } else {
      return actual
    }
  }, '')
  return cleanString(ret)
}

function cleanString(str) {
  return str.replace(/[^a-zA-Z0-9 \-]/g, '_').substring(0, MAX_SIZE_META_STRIPE)
}

function capture(order, cb) {
  let newmeta = {
    organizationId: order.paymentsPlan[0].productInfo.organizationId,
    organizationName: cleanString(order.paymentsPlan[0].productInfo.organizationName),
    productId: order.paymentsPlan[0].productInfo.productId,
    productName: cleanString(order.paymentsPlan[0].productInfo.productName),
    beneficiaryInfo: order.paymentsPlan[0].customInfo ? getVisibleBeneficiaryData(order.paymentsPlan[0].customInfo) : cleanString(order.paymentsPlan[0].beneficiaryInfo.beneficiaryName),
    totalFee: order.paymentsPlan[0].totalFee,
    feePaidUp: order.paymentsPlan[0].feePaidUp,
    feeStripe: order.paymentsPlan[0].feeStripe,
    _id: order._id,
    orderId: order.orderId,
    scheduleId: order.paymentsPlan[0]._id,
    buyerName: cleanString(order.paymentsPlan[0].userInfo.userName)
  }

  debitCardv2(order.paymentsPlan[0].account, order.paymentsPlan[0].price, order.paymentsPlan[0].productInfo.organizationName, order.paymentsPlan[0]._id, order.paymentsPlan[0].paymentId,
    order.paymentsPlan[0].destinationId, order.paymentsPlan[0].totalFee, newmeta, order.paymentsPlan[0].productInfo.statementDescriptor, function (debitErr, data) {
      if (debitErr) {
        order.paymentsPlan[0].attempts.push({ dateAttemp: new Date(), status: 'failed', message: debitErr.detail, last4: order.paymentsPlan[0].last4, accountBrand: order.paymentsPlan[0].accountBrand })
        order.paymentsPlan[0].status = 'failed'
        logger.error('debitCard debitErr', debitErr)
      } else {
        order.paymentsPlan[0].attempts.push({ dateAttemp: new Date(), status: data.status, message: 'done', last4: order.paymentsPlan[0].last4, accountBrand: order.paymentsPlan[0].accountBrand, transferId: data.transfer })
        order.paymentsPlan[0].status = data.status
      }
      order.paymentsPlan[0].wasProcessed = true
      order.paymentsPlan[0].basePrice = order.paymentsPlan[0].basePrice || 0
      let params = {
        baseUrl: config.connections.commerce.baseUrl,
        token: config.connections.commerce.token,
        orderId: order._id,
        paymentPlanId: order.paymentsPlan[0]._id,
        paymentPlan: order.paymentsPlan[0],
        userSysId: 'CronJob'
      }
      CommerceConnect.orderUpdatePayments(params).exec({
        success: function (data) {
          data.err = debitErr
          if (debitErr || data.status === 'failed') {
            createTicketChargeFailed(order, function (err, data) {
              if (err) {
                logger.error('createTicketChargeFailed error', err)
              }
              logger.info('createTicketChargeFailed info', data)
            });
            return cb(null, data);
          } else {
            commerceService.orderGetByorderId(order._id, 1, 1, function (errOrd, ord) {
              console.log('err order: ', errOrd)
              console.log('order base: ', JSON.stringify(ord))
              
              if (errOrd) {
                return cb(errOrd);
              }
              let to = {
                email: order.paymentsPlan[0].email,
                name: order.paymentsPlan[0].userInfo.userName,
              }
              let subject = order.paymentsPlan[0].productInfo.productName;
              let subs = buildSubstitutions(ord.body.orders[0], order.paymentsPlan[0]);
              let template = config.notifications.charge.template

              mail.send(to, subject, subs, template)

              return cb(null, data)
              
            });
            //paymentEmailService.sendProcessedEmailCreditCardv3(order, function (err, dataEmail) {
            //  if (err) return cb(err)
            //  logger.info(' paymentEmailService.sendProcessedEmailCreditCardv3', data.status)
            //  return cb(null, data)
            //})
          }
        },
        error: function (err) {
          return cb(err)
        }
      })
    })
}

function buildSubstitutions(order, pPlan) {
  let ppFiltered = order.paymentsPlan.filter(function (pp) {
    return pPlan._id !== pp._id
  });
  order.paymentsPlan = ppFiltered;
  let futureCharges = []
  let processedCharges = []
  let today = new Date();
  let substitutions = {
    '-customerFirstName-': order.paymentsPlan[0].userInfo.userName,
    '-transactionDate-': moment(pPlan.dateCharge).format('MM-DD-YYYY'),
    '-orderId-': order.orderId,
    '-orgName-': order.paymentsPlan[0].productInfo.organizationName,
    '-productName-': order.paymentsPlan[0].productInfo.productName,
    '-trxDesc-': pPlan.description,
    '-processedCharges-': '',
    '-futureCharges-': ''
  }
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
      futureCharges.push(template)
    } else {
      processedCharges.push(template)
    }
  });
  let table = "<table width='100%'><tr><th>Date</th><th>Description</th><th>Price</th><th>Status</th><th>Account</th></tr>";
  if (processedCharges.length) {
    substitutions['-processedCharges-'] = table + processedCharges.join(" ") + "</table>"
  }
  if (futureCharges.length) {
    substitutions['-futureCharges-'] = table + futureCharges.join(" ") + "</table>"
  }
  return substitutions;
}

function createTicketChargeFailed(order, cb) {
  var subject = '';
  var formTemplate = order.paymentsPlan[0].customInfo.formTemplate;
  var formData = order.paymentsPlan[0].customInfo.formData;

  formTemplate.forEach(function (field, idx, arr) {
    if (field.displayed) {
      subject = subject + ' ' + formData[field.model];
    }
  });

  connector.db(function (err, db) {
    if (err) {
      cb(err);
    }
    let collection = db.collection(collectionName);
    collection.findOne({ key: 'zendesk' }, function (err, doc) {
      if (err || !doc) {
        cb(err)
      }

      var comment = doc.values.comment_ticket_payment_failed
      comment = comment.replace('${order.paymentsPlan[0].userInfo.userName}', order.paymentsPlan[0].userInfo.userName)
      comment = comment.replace('${order.paymentsPlan[0].productInfo.organizationName}', order.paymentsPlan[0].productInfo.organizationName)
      comment = comment.replace('${order.paymentsPlan[0].price}', order.paymentsPlan[0].price.toFixed(2))
      comment = comment.replace('${config.emailVars.baseUrl}', config.emailVars.baseUrl)
      comment = comment.replace('${order.orderId}', order.orderId)

      var ticketParams = {
        username: config.zendesk.username,
        token: config.zendesk.token,
        subdomain: config.zendesk.subdomain,
        requesterEmail: order.paymentsPlan[0].email,
        requesterName: order.paymentsPlan[0].userInfo.userName,
        assigneeEmail: config.zendesk.assigneeEmail,
        subject: order.paymentsPlan[0].productInfo.organizationName + ' Payment Failed for ' + subject,
        comment: comment,
        status: 'pending',
        tags: ['ticket_category_payment_failed_new_card'],
        removeTags: ['signupautomation'],
        customFields: [{
          id: config.zendesk.customFields.balance,
          value: order.paymentsPlan[0].price
        }]
      }
      zendesk.ticketCreate(ticketParams).exec({
        error: function (err) {
          cb(err);
        },
        success: function (result) {
          cb(null, result);
        }
      });

    });
  });
}

function getUserDefaultCardId(user, cb) {
  // Check bank accounts
  listCards(user.meta.TDPaymentId, function (err, data) {
    if (err) return cb(err)
    if (data.data.length === 0) {
      // error
      return cb({ name: 'not-available-payment' }, null)
    }
    let card = data.data[0]
    return cb(null, card.id)
  })
}

function createConnectAccount(account, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.createConnectAccount(account, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function addBankConnectAccount(bankDetails, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.addBankToAccount(bankDetails, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function addToSCustomer(tosDetails, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.addToSCustomer(tosDetails, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function addLegalCustomer(legalDetails, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.addLegalCustomer(legalDetails, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function updateAccount(dataDetails, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.updateAccount(dataDetails, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function getTransfers(stripeId, from, to, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.getTransfers(stripeId, from, to, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function getBalance(stripeId, transferId, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.getBalance(stripeId, transferId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function getChargesList(stripeId, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.getChargesList(stripeId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function listCustomerBanks(stripeId, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.listCustomerBanks(stripeId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function retrieveAccount(stripeId, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.retrieveAccount(stripeId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function plaidAuthenticate(plaidData, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.plaidAuthenticate(plaidData, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function listBanks(customerId, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.listCustomerBanks(customerId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function getDepositCharge(paymentId, accountId, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.getDepositCharge(paymentId, accountId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function getDepositChargeRefund(paymentId, accountId, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.getDepositChargeRefund(paymentId, accountId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function refund(chargeId, reason, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.refund(chargeId, reason, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function retrieveTransfer(transferId, cb) {
  tdPaymentService.init(config.connections.payment)
  tdPaymentService.retrieveTransfer(transferId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

exports.createCustomer = createCustomer
exports.associateCard = associateCard
exports.createCard = createCard
exports.createOrder = createOrder

exports.listCards = listCards

exports.updateOrderDescription = updateOrderDescription
exports.prepareUser = prepareUser
exports.fetchCard = fetchCard
exports.getUserDefaultCardId = getUserDefaultCardId
exports.createConnectAccount = createConnectAccount
exports.addBankConnectAccount = addBankConnectAccount
exports.addToSCustomer = addToSCustomer
exports.addLegalCustomer = addLegalCustomer
exports.updateAccount = updateAccount
exports.updateCustomer = updateCustomer
exports.fetchCustomer = fetchCustomer
exports.capture = capture
exports.getTransfers = getTransfers
exports.getBalance = getBalance
exports.getChargesList = getChargesList
exports.listCustomerBanks = listCustomerBanks
exports.retrieveAccount = retrieveAccount

exports.plaidAuthenticate = plaidAuthenticate

exports.listBanks = listBanks
exports.fetchAccount = fetchAccount
exports.getDepositCharge = getDepositCharge
exports.getDepositChargeRefund = getDepositChargeRefund
exports.retrieveTransfer = retrieveTransfer
exports.refund = refund

