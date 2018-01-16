/**
 * Main application routes
 */

'use strict'
const fs = require('fs')
let config = require('./config/environment')
const errors = require('./components/errors')
let pmx = require('pmx')
let cors = require('cors')

module.exports = function (app) {
  if (process.env.NODE_ENV === 'development') {
    const whitelist = config.cors.corsWhitelist
    let corsOptions = {
      origin: function (origin, callback) {
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1
        callback(null, originIsWhitelisted)
      }
    }
    app.use(cors(corsOptions))
  }

  app.use(function (req, res, next) {
    fs.stat(config.root + '/var/maintenance.pid', function (err, stat) {
      if (err == null) {
        return res.status(503).json({
          'code': 'maintenance',
          'message': 'Site Maintenance: Please try later'
        })
      } else {
        next()
      }
    })
  })

  // Insert routes below
  app.use('/api/v1/auth', require('./api/auth'))
  app.use('/api/v1/wsauth', require('./api/auth/ws'))
  app.use('/api/v1/user', require('./api/user'))
  app.use('/api/v1/payment', require('./api/payment'))
  app.use('/api/v1/commerce', require('./api/commerce'))
  app.use('/api/v1/reports', require('./api/reports'))
  app.use('/api/v1/application', require('./api/application'))
  app.use('/api/v1/organization', require('./api/organization'))
  app.use('/api/v1/media', require('./api/media'))
  app.use('/api/v1/logger', require('./api/logger'))
  app.route('/google55233ee6abe86e62.html').get(function (req, res) {
    res.send('google-site-verification: google55233ee6abe86e62.html')
  })

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|components|app|bower_components|assets)/*')
    .get(errors[404])

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function (req, res) {
      res.status(200).sendFile(app.get('appPath') + '/index.html')
    })

  app.use(pmx.expressErrorHandler())
}
