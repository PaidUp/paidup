const test = require('tape')
const cronjobService = require('../../../../../server/api/application/cronjob.service.js')

test('run', function (t) {
  t.plan(4)
  cronjobService.run(function run (err, result) {
    t.equal(err, null)
    t.assert(result, 'result exists')
    t.assert(result.cron, 'cron exists')
    t.equal(result.cron, 'Done')
  })
})

test('runCompleteOrders', function (t) {
  t.plan(3)
  cronjobService.runCompleteOrders(function emailContact (err, result) {
    t.equal(err, null)
    t.assert(result, 'result exists')
    t.equal(result.orderCompleted, 0)
  })
})

test.onFinish(function () {
  console.log('onFinish cronjobService')
})
