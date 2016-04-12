'use strict'
const test = require('tape')
const proxyquire = require('proxyquire')// .noCallThru()
let authService = proxyquire('./auth.service', {
  'TDCore': {
    authService: {
      init: function (params) {
        return true
      },
      logout: function (token, cb) {
        return cb(null, true)
      },
      verifyRequest: function (userId, cb) {
        return cb(null, true)
      },
      verify: function (data, cb) {
        return cb(null, true)
      },
      passwordResetRequest: function (data, cb) {
        return cb(null, true)
      },
      passwordReset: function (data, cb) {
        return cb(null, true)
      },
      emailUpdate: function (data, userId, cb) {
        return cb(null, true)
      },
      passwordUpdate: function (data, userId, cb) {
        return cb(null, true)
      },
      getSessionSalt: function (token, cb) {
        return cb(null, true)
      }
    },
    userService: {},
    '@noCallThru': true
  }
})

let authServiceFail = proxyquire('./auth.service', {
  'TDCore': {
    authService: {
      init: function (params) {
        return true
      },
      logout: function (token, cb) {
        return cb(true)
      },
      verifyRequest: function (userId, cb) {
        return cb(true)
      },
      verify: function (data, cb) {
        return cb(true)
      },
      passwordResetRequest: function (data, cb) {
        return cb(true)
      },
      passwordReset: function (data, cb) {
        return cb(true)
      },
      emailUpdate: function (data, userId, cb) {
        return cb(true)
      },
      passwordUpdate: function (data, userId, cb) {
        return cb(true)
      },
      getSessionSalt: function (token, cb) {
        return cb(true)
      }
    },
    userService: {},
    '@noCallThru': true
  }
})

test('logout return data', function (t) {
  t.plan(2)
  authService.logout('this is a token', function (err, data) {
    t.equal(err, null)
    t.equal(data, true)
    t.end()
  })
})

test('logout return error', function (t) {
  t.plan(2)
  authServiceFail.logout('this is a token', function (err, data) {
    t.equal(err, true)
    t.equal(data, undefined)
    t.end()
  })
})

test('verifyRequest return data', function (t) {
  t.plan(2)
  authService.verifyRequest('userId', function (err, data) {
    t.equal(err, null)
    t.equal(data, true)
    t.end()
  })
})

test('verifyRequest return error', function (t) {
  t.plan(2)
  authServiceFail.verifyRequest('userId', function (err, data) {
    t.equal(err, true)
    t.equal(data, undefined)
    t.end()
  })
})

test('verify return data', function (t) {
  t.plan(2)
  authService.verifyRequest('data', function (err, data) {
    t.equal(err, null)
    t.equal(data, true)
    t.end()
  })
})

test('verify return error', function (t) {
  t.plan(2)
  authServiceFail.verifyRequest('data', function (err, data) {
    t.equal(err, true)
    t.equal(data, undefined)
    t.end()
  })
})

test('passwordResetRequest return data', function (t) {
  t.plan(2)
  authService.passwordResetRequest('data', function (err, data) {
    t.equal(err, null)
    t.equal(data, true)
    t.end()
  })
})

test('passwordResetRequest return error', function (t) {
  t.plan(2)
  authServiceFail.passwordResetRequest('data', function (err, data) {
    t.equal(err, true)
    t.equal(data, undefined)
    t.end()
  })
})

test('passwordReset return data', function (t) {
  t.plan(2)
  authService.passwordReset('data', function (err, data) {
    t.equal(err, null)
    t.equal(data, true)
    t.end()
  })
})

test('passwordReset return error', function (t) {
  t.plan(2)
  authServiceFail.passwordReset('data', function (err, data) {
    t.equal(err, true)
    t.equal(data, undefined)
    t.end()
  })
})

test('emailUpdate return data', function (t) {
  t.plan(2)
  authService.emailUpdate('data', 'userId', function (err, data) {
    t.equal(err, null)
    t.equal(data, true)
    t.end()
  })
})

test('emailUpdate return error', function (t) {
  t.plan(2)
  authServiceFail.emailUpdate('data', 'userId', function (err, data) {
    t.equal(err, true)
    t.equal(data, undefined)
    t.end()
  })
})

test('passwordUpdate return data', function (t) {
  t.plan(2)
  authService.passwordUpdate('data', 'userId', function (err, data) {
    t.equal(err, null)
    t.equal(data, true)
    t.end()
  })
})

test('passwordUpdate return error', function (t) {
  t.plan(2)
  authServiceFail.passwordUpdate('data', 'userId', function (err, data) {
    t.equal(err, true)
    t.equal(data, undefined)
    t.end()
  })
})

test('getSessionSalt return data', function (t) {
  t.plan(2)
  authService.getSessionSalt('this is a token', function (err, data) {
    t.equal(err, null)
    t.equal(data, true)
    t.end()
  })
})

test('getSessionSalt return error', function (t) {
  t.plan(2)
  authServiceFail.getSessionSalt('this is a token', function (err, data) {
    t.equal(err, true)
    t.equal(data, undefined)
    t.end()
  })
})
