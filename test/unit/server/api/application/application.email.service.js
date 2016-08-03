const test = require('tape')
const applicationEmailService = require('../../../../../server/api/application/application.email.service.js')
const faker = require('faker')

test('applicationEmailService Fail', function (t) {
  t.plan(2)
  applicationEmailService.sendContactEmail({}, function run (err, result) {
    t.equal(err, 'Email is not valid')
    t.equal(result, undefined)
  })
})

test('applicationEmailService Done', function (t) {
  t.plan(3)
  applicationEmailService.sendContactEmail({email: faker.internet.email(), subject: faker.lorem.word(), content: faker.lorem.words()}, function emailContact (err, result) {
    t.equal(err, null)
    t.assert(result, 'result exists')
    t.assert(result.accepted, 'accepted ok')
  })
})

test.onFinish(function () {
  console.log('onFinish applicationEmailService')
})
