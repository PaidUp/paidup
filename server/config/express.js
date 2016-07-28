/**
 * Express configuration
 */

'use strict'

const express = require('express')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const compression = require('compression')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')
const errorHandler = require('errorhandler')
const path = require('path')
const config = require('./environment')

module.exports = function (app) {
  const env = app.get('env')
  const oneDay = 86400000
  app.use(require('prerender-node').set('prerenderToken', config.prerender.token))
  app.set('views', config.root + '/server/views')
  app.engine('html', require('ejs').renderFile)
  app.set('view engine', 'html')
  app.use(compression())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(methodOverride())
  app.use(cookieParser())
  if (env === 'production') {
    app.use(favicon(path.join(config.root, 'client', 'favicon.ico')))
    app.use(express.static(path.join(config.root, 'client'), { 
      dotfile: 'ignore',
        etag: true,
        index: false,
        lastModified: true
    }))
    app.set('appPath', config.root + '/client')
    app.use(morgan('dev'))
  }

  if (env === 'development' || env === 'test') {
    // app.use(require('connect-livereload')())
    app.use(express.static(path.join(config.root, '.tmp')))
    app.use(express.static(path.join(config.root, 'client'), { 
      dotfile: 'ignore',
        etag: true,
        index: false,
        lastModified: true
      }))
    app.set('appPath', config.root + '/client')
    app.use(errorHandler()) // Error handler - has to be last
  }

  if (env === 'development') {
    app.use(morgan('dev'))
  }
}
