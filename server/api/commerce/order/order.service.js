'use strict'

const CommerceConnector = require('paidup-commerce-connect')
const ScheduleConnector = require('paidup-schedule-connect')
const config = require('../../../config/environment')
const CatalogService = require('../catalog/catalog.service')
const paymentEmailService = require('../../payment/payment.email.service')
const paymentService = require('../../payment/payment.service')
const logger = require('../../../config/logger')

var OrderService = {
  calculatePrices: function calculatePrices (body, cb) {
    CatalogService.getProduct(body.productId, function (errProduct, dataProduct) {
      if (errProduct) {
        return cb(errProduct)
      }
      let dues = dataProduct.paymentPlans[body.paymentPlanSelected].dues
      let params = []

      dues.forEach(function (ele, idx, arr) {
        ele.applyDiscount = body.discount > 0
        ele.discount = body.discount
        ele.couponId = body.couponId

        params.push({
          version: ele.version,
          originalPrice: ele.amount,
          stripePercent: dataProduct.processingFees.cardFeeActual,
          stripeFlat: dataProduct.processingFees.cardFeeFlatActual,
          paidUpFee: dataProduct.collectionsFee.fee,
          discount: ele.applyDiscount ? ele.discount : 0,
          payProcessing: dataProduct.paysFees.processing,
          payCollecting: dataProduct.paysFees.collections,
          description: ele.description,
          dateCharge: ele.dateCharge
        })
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

  newOrder: function newOrder (body, prices, dataProduct, cb) {
    paymentService.fetchCard(body.paymentId, body.account, function (err, card) {
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
      prices.forEach(function (ele, idx, arr) {
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
          discount: body.discount,
          discountCode: body.couponId,
          paymentId: body.paymentId,
          wasProcessed: false,
          status: 'pending',
          processingFees: dataProduct.processingFees,
          collectionsFee: dataProduct.collectionsFee,
          paysFees: dataProduct.paysFees,
          typeAccount: body.typeAccount,
          account: body.account,
          last4: card.last4,
          accountBrand: card.brand,
          description: ele.description,
          productInfo: {
            productId: dataProduct._id,
            productName: body.productName,
            productImage: body.productImage,
            organizationId: body.organizationId,
            organizationName: body.organizationName,
            organizationLocation: body.organizationLocation,
            organizationImage: body.organizationImage
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
          return cb(null, card.last4, orderResult)
        }
      })
    })
  },
  sendEmail: function sendEmail (last4, body, dataProduct, orderResult) {
    // body.email
    let emailParams = {
      orderId: orderResult.body.orderId,
      email: body.email,
      last4: last4,
      amount: 0,
      schedules: [],
      product: dataProduct.details.name
    }
    orderResult.body.paymentsPlan.forEach(function (ele, idx, arr) {
      emailParams.amount = emailParams.amount + ele.price
      emailParams.schedules.push({
        nextPaymentDue: ele.dateCharge,
        price: Number(ele.price).toFixed(2)
      })
    })
    emailParams.amount = Number(emailParams.amount).toFixed(2)
    paymentEmailService.sendNewOrderEmail(emailParams, function (err, data) {
      if (err) {
        logger.error('Send New Order Email: Error', err)
      } else {
        logger.debug('Send New Order Email: ', data)
      }
    })
  }
}

function createOrder (body, cb) {
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
          OrderService.sendEmail(last4, body, dataProduct, orderResult)
          cb(null, orderResult)
        }
      })
    }
  })
}

function orderPaymentRecent (userId, limit, cb) {
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

function orderPaymentNext (userId, limit, cb) {
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

function orderPaymentActive (userId, limit, cb) {
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

function orderGet (userId, limit, sort, cb) {
  CommerceConnector.orderGet({
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
      return cb(null, result)
    }
  })
}
// machinepack exec order-get-organization --organizationId='acct_18AQWDGKajSrnujf' --token='TDCommerceToken-CHANGE-ME!' --baseUrl='http://localhost:9002' --limit='1000' --sort='1'
function orderGetOrganization (organizationId, limit, sort, cb) {
  CommerceConnector.orderGetOrganization({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    organizationId: organizationId,
    limit: limit,
    sort: sort
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

module.exports = {
  createOrder: createOrder,
  orderPaymentRecent: orderPaymentRecent,
  orderPaymentNext: orderPaymentNext,
  orderPaymentActive: orderPaymentActive,
  orderGet: orderGet,
  orderGetOrganization: orderGetOrganization
}
