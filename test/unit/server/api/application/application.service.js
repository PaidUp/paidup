const test = require('tape')
const applicationService = require('../../../../../server/api/application/application.service.js')
const faker = require('faker')

test('emailContact missing data contact', function (t) {
  t.plan(2)
  applicationService.emailContact({}, function emailContact (err, result) {
    t.equal(err, 'data contact is missing')
    t.equal(result, undefined)
  })
})

test('emailContact Done', function (t) {
  t.plan(3)
  applicationService.emailContact({email: faker.internet.email(), subject: faker.lorem.word(), content: faker.lorem.words()}, function emailContact (err, result) {
    t.equal(err, null)
    t.assert(result, 'result exists')
    t.assert(result.accepted, 'accepted ok')
  })
})

test('configView', function (t) {
  t.plan(5)
  applicationService.configView(function configView (err, result) {
    t.equal(err, null)
    t.assert(result, 'result exists')
    t.assert(result.marketplace, 'marketplace ok')
    t.assert(result.stripeApiPublic, 'stripeApiPublic ok')
    t.assert(result.mixpanelApiKey, 'mixpanelApiKey ok')
  })
})

test.onFinish(function () {
  console.log('onFinish applicationService')
})
