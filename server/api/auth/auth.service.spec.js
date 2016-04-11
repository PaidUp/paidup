'use strict'
var test = require('tape')
var proxyquire = require('proxyquire').noCallThru()

test('getTokenFromRequest without error', function (t) {
  var authService = proxyquire('./auth.service', {
    'TDCore': {
      authService: {
        init: function (params) {
          return true
        },
        logout: function (params, cb) {
          return cb(null, true)
        }
      },
      userService: {}
    }
  })
  t.plan(2)
  authService.logout('this is a token', function (err, data) {
    t.equal(err, null)
    t.equal(data, true)
    t.end()
  })
})

test('getTokenFromRequest with error', function (t) {
  var authService = proxyquire('./auth.service', {
    'TDCore': {
      authService: {
        init: function (params) {
          return true
        },
        logout: function (params, cb) {
          return cb(true)
        }
      },
      userService: {}
    }
  })
  t.plan(2)
  authService.logout('this is a token', function (err, data) {
    t.equal(err, true)
    t.equal(data, undefined)
    t.end()
  })
})
