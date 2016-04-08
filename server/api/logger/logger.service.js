'use strict'

var logger = require('../../config/logger')

var DEBUG = 'debug'
var INFO = 'info'
var WARN = 'warn'
var ERROR = 'error'

exports.put = function (type, msg) {
  if (type === DEBUG | type === INFO | type === WARN | type === ERROR) {
    logger[type](msg)
  } else {
    logger.error('Type error must be debug or info or warn or error')
  }
}
