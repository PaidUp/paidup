'use strict'

const CommerceConnector = require('paidup-commerce-connect')
const ScheduleConnector = require('paidup-schedule-connect')
const config = require('../../../config/environment')
const mail = require('../../../components/util/mail');
const CatalogService = require('../catalog/catalog.service')
const paymentEmailService = require('../../payment/payment.email.service')
const paymentService = require('../../payment/payment.service')
const logger = require('../../../config/logger')
const moment = require('moment')
const zendesk = require('paidup-zendesk-connect')
const connector = require('../../../db/connector');
const collectionName = config.mongo.options.prefix + 'properties';


var OrderService = {
  calculatePrices: function calculatePrices(body, cb) {
    CatalogService.getProduct(body.productId, function (errProduct, dataProduct) {
      if (errProduct) {
        return cb(errProduct)
      }
      let paymentMethods = dataProduct.paymentPlans[body.paymentPlanSelected].paymentMethods
      let dues = dataProduct.paymentPlans[body.paymentPlanSelected].dues
      let params = []

      dues.forEach(function (ele, idx, arr) {
        if (body.discount > 0) {
          ele.applyDiscount = body.discount > 0
          ele.discount = body.discount
          ele.couponId = body.couponId
        }

        var param = {
          version: ele.version,
          originalPrice: ele.amount,
          paidUpFee: dataProduct.collectionsFee.fee,
          paidUpFlat: dataProduct.collectionsFee.feeFlat || 0,
          discount: ele.applyDiscount ? ele.discount : 0,
          payProcessing: dataProduct.paysFees.processing,
          payCollecting: dataProduct.paysFees.collections,
          description: ele.description,
          dateCharge: ele.dateCharge,
          type: body.typeAccount,
          capAmount: dataProduct.processingFees.achFeeCapDisplay || 0,
          stripePercent: dataProduct.processingFees.cardFeeDisplay,
          stripeFlat: dataProduct.processingFees.cardFeeFlatDisplay,
          stripeAchPercent: dataProduct.processingFees.achFeeDisplay,
          stripeAchFlat: dataProduct.processingFees.achFeeFlatDisplay
        }
        params.push(param)
      })

      let reqSchedule = {
        baseUrl: config.connections.schedule.baseUrl,
        token: config.connections.schedule.token,
        prices: params
      }

      ScheduleConnector.calculatePrices(reqSchedule).exec({
        // An unexpected error occurred.
        error: function (err) {
          return cb(err)
        },
        // OK.
        success: function (prices) {
          return cb(null, JSON.parse(prices.body).prices, dataProduct)
        }
      })
    })
  },

  newOrder: function newOrder(body, prices, dataProduct, cb) {
    paymentService.fetchAccount(body.paymentId, body.account, function (err, account) {
      if (err) {
        return cb(err)
      }

      let orderReq = {
        baseUrl: config.connections.commerce.baseUrl,
        token: config.connections.commerce.token,
        userId: body.userId,
        description: dataProduct.details.description,
        paymentsPlan: []
      }

      if (!dataProduct.processingFees.achFeeCapActual) {
        dataProduct.processingFees.achFeeCapActual = 0
      }

      if (!dataProduct.processingFees.achFeeCapDisplay) {
        dataProduct.processingFees.achFeeCapDisplay = 0
      }


      prices.forEach(function (ele, idx, arr) {
        if (!dataProduct.processingFees.achFeeCapDisplay) {
          dataProduct.processingFees.achFeeCapDisplay = 0;
        }
        if (!dataProduct.processingFees.achFeeCapActual) {
          dataProduct.processingFees.achFeeCapActual = 0;
        }

        orderReq.paymentsPlan.push({
          version: ele.version,
          email: body.email,
          destinationId: dataProduct.details.paymentId,
          dateCharge: ele.dateCharge,
          originalPrice: ele.originalPrice,
          totalFee: ele.totalFee,
          feePaidUp: ele.feePaidUp,
          feeStripe: ele.feeStripe,
          price: ele.owedPrice,
          basePrice: ele.basePrice,
          discount: (ele.discount / ele.originalPrice) * 100,
          discountCode: body.couponId,
          paymentId: body.paymentId,
          wasProcessed: false,
          status: 'pending',
          processingFees: dataProduct.processingFees,
          collectionsFee: dataProduct.collectionsFee,
          paymentMethods: dataProduct.paymentPlans[body.paymentPlanSelected].paymentMethods || ['card'],
          paysFees: dataProduct.paysFees,
          typeAccount: body.typeAccount,
          account: body.account,
          last4: account.last4,
          accountBrand: account.brand || account.bankName,
          description: ele.description,
          productInfo: {
            productId: dataProduct._id,
            productName: body.productName,
            productImage: body.productImage,
            organizationId: body.organizationId,
            organizationName: body.organizationName,
            organizationLocation: body.organizationLocation,
            organizationImage: body.organizationImage,
            statementDescriptor: dataProduct.details.statementDescriptor || ""
          },
          userInfo: {
            userId: body.userId,
            userName: body.userName
          },
          customInfo: body.customInfo
        })
      })
      CommerceConnector.orderCreate(orderReq).exec({
        // An unexpected error occurred.
        error: function (err) {
          return cb(err)
        },
        // OK.
        success: function (orderResult) {
          return cb(null, account.last4, orderResult)
        }
      })
    })
  },
  sendEmail: function sendEmail(order) {
    let to = {
      email: order.paymentsPlan[0].email,
      name: order.paymentsPlan[0].userInfo.userName,
    }
    let subject = order.paymentsPlan[0].productInfo.productName;
    let subs = buildSubstitutions(order)
    let template = config.notifications.invoice.template

    mail.send(to, subject, subs, template)
  }
}

function buildSubstitutions(order) {
  let futureCharges = []
  let today = new Date();
  let substitutions = {
    '-customerFirstName-': order.paymentsPlan[0].userInfo.userName,
    '-orderId-': order.orderId,
    '-orgName-': order.paymentsPlan[0].productInfo.organizationName,
    '-productName-': order.paymentsPlan[0].productInfo.productName,
    '-futureCharges-': ""
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
    futureCharges.push(template)
  });
  let table = "<table width='100%'><tr><th>Date</th><th>Description</th><th>Price</th><th>Status</th><th>Account</th></tr>";
  substitutions['-futureCharges-'] = table + futureCharges.join(" ") + "</table>"
  return substitutions;
}

function createOrder(body, cb) {
  logger.debug('Create Order: Params', body)
  OrderService.calculatePrices(body, function (errPrices, prices, dataProduct) {
    if (errPrices) {
      logger.error('Create Order: Error Prices', errPrices)
      return cb(errPrices)
    } else {
      logger.debug('Create Order: Prices', prices)
      logger.debug('Create Order: Data Product Prices', dataProduct)

      OrderService.newOrder(body, prices, dataProduct, function (errorOrderResult, last4, orderResult) {
        if (errorOrderResult) {
          logger.error('Create Order: Error New Order', orderResult)
          return cb(errorOrderResult)
        } else {
          logger.debug('Create Order: New Order', dataProduct)
          logger.debug('Create Order: New Order Result', orderResult)
          updateTicketAfterCreateOrder(body.email, orderResult.body.orderId, function (err, res) {
            if (err) {
              logger.debug('update ticket updateTicketAfterCreateOrder err', err)
            } else {
              logger.debug('update ticket updateTicketAfterCreateOrder', res)
            }
            updateUserAfterCreateOrder(body.email, orderResult.body, function (err, res) {
              if (err) {
                logger.debug('update ticket updateUserAfterCreateOrder err', err)
              } else {
                logger.debug('update ticket updateUserAfterCreateOrder', res)
              }
            });
          })
          OrderService.sendEmail(orderResult.body)
          cb(null, orderResult)
        }
      })
    }
  })
}

function updateTicketAfterCreateOrder(userEmail, orderId, cb) {
  var retrieveTicketParams = {
    username: config.zendesk.username,
    token: config.zendesk.token,
    subdomain: config.zendesk.subdomain,
    requesterEmail: userEmail
  }
  zendesk.ticketRetrieveByUser(retrieveTicketParams).exec({
    error: function (err) {
      cb(err);
    },
    success: function (result) {
      if (result.length) {
        var ticket = result[result.length - 1];
        var addCommentParams = {
          username: config.zendesk.username,
          token: config.zendesk.token,
          subdomain: config.zendesk.subdomain,
          ticketId: ticket.id,
          tags: "ordercreated",
          comment: `User has created an order 
            Order Id: ${orderId}
            Order Date ${new Date().toLocaleDateString('en-US')}
          `,
          status: "open",
          isPublic: false
        }
        zendesk.ticketAddComment(addCommentParams).exec({
          error: function (err) {
            cb(err);
          },
          success: function (result) {
            cb(null, result);
          }
        });
      } else {
        cb(null, false)
      }
    }
  });
}

function updateUserAfterCreateOrder(userEmail, order, cb) {
  var beneficiary = '';
  var formTemplate = order.paymentsPlan[0].customInfo.formTemplate;
  var formData = order.paymentsPlan[0].customInfo.formData;

  formTemplate.forEach(function (field, idx, arr) {
    if (field.displayed) {
      if (idx === 0) {
        beneficiary = formData[field.model];
      } else {
        beneficiary = beneficiary + ' ' + formData[field.model];
      }
    }
  });

  var userParams = {
    username: config.zendesk.username,
    token: config.zendesk.token,
    subdomain: config.zendesk.subdomain,
    userEmail: userEmail,
    paidupcustomer: 'paidupcustomer',
    userType: 'user_type_paidup_customer',
    products: order.paymentsPlan[0].productInfo.productName,
    organization: order.paymentsPlan[0].productInfo.organizationName,
    beneficiary: beneficiary,
    tags: []
  }
  zendesk.userUpdate(userParams).exec({
    error: function (err) {
      cb(err);
    },
    success: function (result) {
      cb(null, result)
    }
  });
}

function orderPaymentRecent(userId, limit, cb) {
  CommerceConnector.orderPaymentRecent({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    userId: userId,
    limit: limit
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      return cb(err)
    },
    // OK.
    success: function (result) {
      return cb(null, result)
    }
  })
}

function orderPaymentNext(userId, limit, cb) {
  CommerceConnector.orderPaymentNext({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    userId: userId,
    limit: limit
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      return cb(err)
    },
    // OK.
    success: function (result) {
      return cb(null, result)
    }
  })
}

function orderPaymentActive(userId, limit, cb) {
  CommerceConnector.orderActive({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    userId: userId,
    limit: limit
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      return cb(err)
    },
    // OK.
    success: function (result) {
      return cb(null, result)
    }
  })
}

function orderGet(userId, limit, sort, cb) {
  CommerceConnector.orderGetStr({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    userId: userId,
    limit: limit,
    sort: sort
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      return cb(err)
    },
    // OK.
    success: function (result) {
      result.body = JSON.parse(result.body)
      return cb(null, result)
    }
  })
}

function orderGetByorderId(orderId, limit, sort, cb) {
  CommerceConnector.orderGetStr({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    orderId: orderId,
    limit: limit,
    sort: sort
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      return cb(err)
    },
    // OK.
    success: function (result) {
      result.body = JSON.parse(result.body)
      return cb(null, result)
    }
  })
}

function orderCancel(params, cb) {
  CommerceConnector.orderCancel({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    orderId: params.orderId,
    userSysId: params.userSysId
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      return cb(err)
    },
    // OK.
    success: function (result) {
      return cb(null, result)
    }
  })
}

function removePaymentPlan(params, cb) {
  CommerceConnector.orderPaymentRemove({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    orderId: params.orderId,
    paymentPlanId: params.paymentPlanId,
    userSysId: params.userSysId
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      return cb(err)
    },
    // OK.
    success: function (result) {
      return cb(null, result)
    }
  })
}

// machinepack exec order-get-organization --organizationId='acct_18AQWDGKajSrnujf' --token='TDCommerceToken-CHANGE-ME!' --baseUrl='http://localhost:9002' --limit='1000' --sort='1'
function orderGetOrganization(organizationId, limit, sort, from, to, cb) {
  CommerceConnector.orderGetOrganization({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    organizationId: organizationId,
    limit: limit,
    sort: sort,
    fromDate: from,
    toDate: to
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      console.log('err', err)
      return cb(err)
    },
    // OK.
    success: function (result) {
      return cb(null, result)
    }
  })
}

function orderSearch(params, cb) {
  CommerceConnector.orderSearch({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    params: params
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      return cb(err)
    },
    // OK.
    success: function (orderResult) {
      return cb(null, orderResult)
    }
  })
};

function orderHistory(params, cb) {
  CommerceConnector.orderHistory({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    orderId: params.orderId
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      return cb(err)
    },
    // OK.
    success: function (orderResult) {
      return cb(null, orderResult)
    }
  })
};

function orderTransactions(organizationId, cb) {
  CommerceConnector.orderTransactionsOrganization({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    organizationId: organizationId
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      return cb(err)
    },
    // OK.
    success: function (transactions) {
      let header = ['transactionId', 'created', 'organizationId', 'organization', 'location', 'productId', 'product',
        'amount', 'status', 'totalFee', 'depositAmount', 'depositId', 'orderId', 'customerId', 'customerName',
        'accounType', 'last4Digits'];
      let headerMeta = [];

      transactions.body.forEach(function (tr, idx, arr) {
        if (tr.paymentsPlan.customInfo) {
          for (var key in tr.paymentsPlan.customInfo.formData) {
            if (headerMeta.indexOf(key) < 0) {
              headerMeta.push(key);
            }
          }
        }
      });

      let res = transactions.body.map(function (transaction) {
        let ele = {
          transactionId: transaction.paymentsPlan.attempts._id || "",
          created: moment(transaction.paymentsPlan.attempts.dateAttemp).format('MM/DD/YYYY hh:mm') || "",
          organizationId: transaction.paymentsPlan.productInfo.organizationId || "",
          organization: transaction.paymentsPlan.productInfo.organizationName || "",
          location: transaction.paymentsPlan.productInfo.organizationLocation || "",
          productId: transaction.paymentsPlan.productInfo.productId || "",
          product: transaction.paymentsPlan.productInfo.productName || "",
          amount: transaction.paymentsPlan.price || "",
          status: transaction.paymentsPlan.attempts.status || "",
          totalFee: transaction.paymentsPlan.totalFee || "",
          depositAmount: getDepositAmount(transaction.paymentsPlan.price || "",
            transaction.paymentsPlan.totalFee || "",
            transaction.paymentsPlan.attempts.status) || "",
          depositId: transaction.paymentsPlan.attempts.transferId || "",
          orderId: transaction.orderId || "",
          customerId: transaction.paymentsPlan.userInfo.userId || "",
          customerName: transaction.paymentsPlan.userInfo.userName || "",
          accounType: transaction.paymentsPlan.attempts.accountBrand || "",
          last4: transaction.paymentsPlan.attempts.last4 ? transaction.paymentsPlan.attempts.last4 : "",
        }

        headerMeta.forEach(function (trh, idx, arr) {
          if (transaction.paymentsPlan.customInfo) {
            ele[trh] = transaction.paymentsPlan.customInfo.formData[trh] || "";
          } else {
            ele[trh] = '';
          }
        });
        return ele;
      })

      headerMeta.forEach(function (trh, idx, arr) {
        header.push(trh + " (metadata)")
      })

      transactions.body = res;
      return cb(null, {
        header: header,
        content: res
      })
    }
  })
};

function getDepositAmount(price, totalFee, status) {
  if (status === 'failed') {
    return 0;
  } else if (status === 'succeeded') {
    return price - totalFee;
  } else if (status === 'refunded') {
    return (price - totalFee) * -1;
  } else {
    return '';
  }
}

function addPaymentPlan(params, cb) {
  getPaymentPlan(params.orderId, null, function (err, pp) {
    if (err) {
      return cb(err)
    } else {
      params.version = pp.version || 'v1'
      editPaymentPlan(pp, params, function (err2, pp2) {
        if (err2) {
          return cb(err2)
        } else {
          pp2.attempts = []
          pp2.status = 'pending'
          delete pp2.id

          let ppe = {
            baseUrl: config.connections.commerce.baseUrl,
            token: config.connections.commerce.token,
            userSysId: params.userSysId,
            orderId: params.orderId,
            paymentsPlan: [pp2]
          }
          CommerceConnector.orderAddPayments(ppe).exec({
            // An unexpected error occurred.
            error: function (err) {
              console.log('err', err)

              return cb(err)
            },
            // OK.
            success: function (orderResult) {
              return cb(null, orderResult)
            }
          })
        }
      })
    }
  })
}

function editOrder(params, cb) {
  getPaymentPlan(params.orderId, params.paymentPlanId, function (err, pp) {
    if (err) {
      console.log('throw ee', err)
      return cb(err)
    } else {

      editPaymentPlan(pp, params, function (err2, pp2) {
        if (err2) {
          console.log('throw err2 ', err2)

          return cb(err2)
        } else {
          let ppe = {
            baseUrl: config.connections.commerce.baseUrl,
            token: config.connections.commerce.token,
            orderId: params.orderId,
            userSysId: params.userSysId,
            paymentPlanId: params.paymentPlanId,
            paymentPlan: pp2
          }

          CommerceConnector.orderUpdatePayments(ppe).exec({
            // An unexpected error occurred.
            error: function (err) {
              console.log('throw err3 ', err)
              return cb(err)
            },
            // OK.
            success: function (orderResult) {
              return cb(null, orderResult)
            }
          })
        }
      })
    }
  })
}

function editPaymentPlan(pp, params, cb) {
  let originalPrice = params.originalPrice || pp.originalPrice
  let description = params.description || pp.description
  let dateCharge = params.dateCharge || pp.dateCharge
  let status = params.status || pp.status
  let wasProcessed = params.wasProcessed || false
  let paymentMethods = pp.paymentMethods || ['card'];
  let attempts = params.attempts || pp.attempts;

  let paramsCalculation = {
    version: params.version,
    baseUrl: config.connections.schedule.baseUrl,
    token: config.connections.schedule.token,
    originalPrice: originalPrice,
    paidUpFee: pp.collectionsFee.fee,
    paidUpFlat: pp.collectionsFee.feeFlat || 0,
    discount: pp.discount,
    payProcessing: pp.paysFees.processing,
    payCollecting: pp.paysFees.collections,
    type: pp.typeAccount || 'card',
    capAmount: pp.processingFees.achFeeCapDisplay || 0,
    stripePercent: pp.processingFees.cardFeeDisplay,
    stripeFlat: pp.processingFees.cardFeeFlatDisplay,
    stripeAchPercent: pp.processingFees.achFeeDisplay,
    stripeAchFlat: pp.processingFees.achFeeFlatDisplay
  }

  ScheduleConnector.calculatePrice(paramsCalculation).exec({
    // An unexpected error occurred.
    error: function (err) {
      return cb(err)
    },
    // OK.
    success: function (result) {
      result.body = JSON.parse(result.body)
      pp.version = result.body.version
      pp.price = result.body.owedPrice
      pp.basePrice = result.body.basePrice
      pp.originalPrice = originalPrice
      pp.description = description
      pp.dateCharge = dateCharge
      pp.wasProcessed = wasProcessed
      pp.account = params.account || pp.account
      pp.accountBrand = params.accountBrand || pp.accountBrand
      pp.last4 = params.last4 || pp.last4
      pp.typeAccount = params.typeAccount || pp.typeAccount
      pp.totalFee = result.body.totalFee
      pp.feeStripe = result.body.feeStripe
      pp.feePaidUp = result.body.feePaidUp
      pp.status = status
      pp.processingFees.achFeeCapActual = pp.processingFees.achFeeCapActual || 0;
      pp.processingFees.achFeeCapDisplay = pp.processingFees.achFeeCapDisplay || 0;
      pp.paymentMethods = pp.paymentMethods || ['card']
      pp.attempts = attempts
      pp.productInfo.statementDescriptor = pp.productInfo.statementDescriptor || ""
      return cb(null, pp)
    }
  })
}

function getPaymentPlan(orderId, paymentPlanId, cb) {
  CommerceConnector.orderGetStr({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    orderId: orderId,
    limit: 1
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      return cb(err)
    },
    // OK.
    success: function (result) {
      let res = null
      if (!paymentPlanId) {
        res = JSON.parse(result.body).orders[0].paymentsPlan[0]
      } else {
        JSON.parse(result.body).orders[0].paymentsPlan.map(function (pp) {
          if (pp._id === paymentPlanId) {
            res = pp
          }
        })
      }
      if (res) {
        return cb(null, res)
      }
      return cb('payment plan not found')
    }
  })
}

function editAllPaymentsPlan(orderId, oldPaymentsPlan, cb) {
  orderGetByorderId(orderId, 1, 1, function () { })

  cb(null, { body: true })
  // let paramsForCalculations = []

  // oldPaymentsPlan.forEach(function (pp, idx, arr) {
  //   paramsForCalculations.push({
  //     version: pp.version,
  //     description : pp._id,
  //     dateCharge : pp.dateCharge,
  //     originalPrice : pp.originalPrice,
  //     stripePercent : pp.processingFees.cardFeeDisplay,
  //     stripeFlat : pp.processingFees.cardFeeFlatDisplay,
  //     paidUpFee : 5,
  //     discount : 10,
  //     payProcessing : false,
  //     payCollecting : true
  //   })
  // })
}

function orderUpdateWebhook(data, cb) {
  if(data.object.status !== 'succeeded'){
    createTicketChargeFailed(data, function (err, data) {
        console.log("err:", err)
      });
  }

  CommerceConnector.orderUpdateWebhook({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    data: data
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

function createTicketChargeFailed(data, cb) {
  var subject = data.object.metadata.beneficiaryInfo;

  connector.db(function (err, db) {
    if (err) {
      cb(err);
    }
    let collection = db.collection(collectionName);
    collection.findOne({ key: 'zendesk' }, function (err, doc) {
      if (err || !doc) {
        cb(err)
      }
      orderGetByorderId(data.object.metadata._id, 1, 1, function (err, dataOrders) {
        var order = dataOrders.body.orders[0];
        if (err) {
          return cb(err);
        }
        var email = order.paymentsPlan[0].email;
        var comment = doc.values.comment_ticket_payment_failed
        var amount = parseInt(data.object.amount) / 100;
        comment = comment.replace('${order.paymentsPlan[0].userInfo.userName}', data.object.metadata.buyerName)
        comment = comment.replace('${order.paymentsPlan[0].productInfo.organizationName}', data.object.metadata.organizationName)
        comment = comment.replace('${order.paymentsPlan[0].price}', amount)
        comment = comment.replace('${config.emailVars.baseUrl}', config.emailVars.baseUrl)
        comment = comment.replace('${order.orderId}', data.object.metadata.orderId)

        var ticketParams = {
          username: config.zendesk.username,
          token: config.zendesk.token,
          subdomain: config.zendesk.subdomain,
          requesterEmail: email,
          requesterName: data.object.metadata.buyerName,
          assigneeEmail: config.zendesk.assigneeEmail,
          subject: data.object.metadata.organizationName + ' Payment Failed for ' + subject,
          comment: comment,
          status: 'pending',
          tags: ['ticket_category_payment_failed_new_card'],
          removeTags: ['signupautomation'],
          customFields: [{
            id: config.zendesk.customFields.balance,
            value: amount
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

      })

    });
  });
}

module.exports = {
  createOrder: createOrder,
  orderPaymentRecent: orderPaymentRecent,
  orderPaymentNext: orderPaymentNext,
  orderPaymentActive: orderPaymentActive,
  orderGet: orderGet,
  orderGetOrganization: orderGetOrganization,
  orderGetByorderId: orderGetByorderId,
  orderSearch: orderSearch,
  addPaymentPlan: addPaymentPlan,
  editOrder: editOrder,
  editAllPaymentsPlan: editAllPaymentsPlan,
  orderUpdateWebhook: orderUpdateWebhook,
  orderHistory: orderHistory,
  orderTransactions: orderTransactions,
  orderCancel: orderCancel,
  removePaymentPlan: removePaymentPlan
}
