/**
 * Main application file
 */

'use strict'

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const pmx = require('pmx').init({
  http: true, // HTTP routes logging (default: true)
  ignore_routes: [/socket\.io/, /notFound/], // Ignore http routes with this pattern (Default: [])
  errors: true, // Exceptions loggin (default: true)
  custom_probes: true, // Auto expose JS Loop Latency and HTTP req/s as custom metrics
  network: true, // Network monitoring at the application level
  ports: true  // Shows which ports your app is listening on (default: false)
})

const express = require('express')
const config = require('./config/environment')
const logger = require('./config/logger').info

// Setup server
const app = express()
const server = require('http').createServer(app)
require('./config/express')(app)
require('./routes')(app)

// Start server
if (config.env !== 'test') {
  try {
    server.listen(config.port, config.ip, function () {
      console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
    })
  } catch (err) {
    console.log('error:', err)
  }
}

const TDError = require('./components/TD/Error')
app.use(logger)
// Expose app
exports = module.exports = app
