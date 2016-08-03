var test = require('tape')

test('template test', function (t) {
  t.plan(1)

  t.equal(typeof Date.now, 'function')
})

test.onFinish(function () {
  console.log('onFinish template')
})
