const test = require('tape')
const orderController = require('../../../../../server/api/commerce/order/order.controller.js')

test.only('createOrder', function (t) {
  t.plan(1)
  orderController.createOrder({ user: {_id: '_id', userId: 'userId', userName: 'userName', paymentId: 'paymentId', email: 'email', meta: {TDPayment: 'TDPayment'}}, body: {some: 'some'} }, function createOrder (err, result) {
    console.log('err', err)
    console.log('result', result)
    t.equal(err, null)
  })
})

test.onFinish(function () {
  console.log('onFinish cronjobService')
})
