'use strict'

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/paidUp-dev'
  },
  seedDB: true,
  cors : {
    enable : true,
    corsWhitelist : ['http://localhost:4000', 'https://admin.getpaidup.com', 'https://admstg.getpaidup.com', 'https://admdev.getpaidup.com']
  }
}
