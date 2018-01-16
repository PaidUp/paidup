'use strict'

var tdAuthService = require('TDCore').authService
var config = require('../../config/environment')
var compose = require('composable-middleware')
var tdUserService = require('TDCore').userService

const connector = require('../../db/connector');
const collectionName = config.mongo.options.prefix + 'third_party_client';

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated(resource) {
  return compose()
    .use(function (req, res, next) {
      let token = getTokenFromRequest(req)
      req.headers.authorization = 'Bearer ' + token
      tdUserService.init(config.connections.user)
      tdUserService.current(token, function (err, data) {
        if (err && err.code === 'AuthFailed') {
          return res.status(401).end();
          //return next(err)
        } else  if(data && resource && data.permissions[resource]){
          req.user = data
          return next();
        } else if (!resource && data && data._id) {
          req.user = data
          return next()
        } else {
          return res.status(401).end();
        }
      })
    })
}

function isValidWsClient() {
  return compose()
    .use(function (req, res, next) {
      connector.db(function (err, db) {
        if (err) {
          return res.sendStatus(500);
        }
        let token = req.headers.authorization
        let collection = db.collection(collectionName);
        collection.findOne({ token: token }, function (err, doc) {
          if (err || !doc || !doc.isActive) {
            return res.sendStatus(401);
          }
          req.body.referrer = doc.name
          return next()
        });

      });

    })
}

/**
 * Get the token from HTTP Request
 * @param req
 * @returns {*}
 */
function getTokenFromRequest(req) {
  let token = null
  // allow access_token to be passed through query parameter as well
  if (req.query && req.query.hasOwnProperty('token')) {
    token = req.query.token
  } else if (req.body && req.body.token) {
    token = req.body.token
  } else if (req.query && req.query.hasOwnProperty('access_token')) {
    token = req.query.token
  } else if (req.headers && req.headers.authorization) {
    token = req.headers.authorization.slice(7, req.headers.authorization.length)
  }
  return token
}

function logout(token, cb) {
  tdAuthService.init(config.connections.user)
  tdAuthService.logout(token, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function verifyRequest(userId, cb) {
  tdAuthService.init(config.connections.user)
  tdAuthService.verifyRequest(userId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function verify(data, cb) {
  tdAuthService.init(config.connections.user)
  tdAuthService.verify(data, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function passwordResetRequest(data, cb) {
  tdAuthService.init(config.connections.user)
  tdAuthService.passwordResetRequest(data, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function passwordReset(data, cb) {
  tdAuthService.init(config.connections.user)
  tdAuthService.passwordReset(data, function (err, dat) {
    if (err) return cb(err)
    return cb(null, dat)
  })
}

function emailUpdate(data, userId, cb) {
  tdAuthService.init(config.connections.user)
  tdAuthService.emailUpdate(data, userId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function passwordUpdate(data, userId, cb) {
  tdAuthService.init(config.connections.user)
  tdAuthService.passwordUpdate(data, userId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function getSessionSalt(token, cb) {
  tdAuthService.init(config.connections.user)
  tdAuthService.getSessionSalt(token, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

exports.logout = logout
exports.verifyRequest = verifyRequest
exports.verify = verify
exports.passwordResetRequest = passwordResetRequest
exports.passwordReset = passwordReset
exports.emailUpdate = emailUpdate
exports.passwordUpdate = passwordUpdate
exports.isAuthenticated = isAuthenticated
exports.getSessionSalt = getSessionSalt
exports.isValidWsClient = isValidWsClient
