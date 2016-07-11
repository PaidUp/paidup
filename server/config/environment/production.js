'use strict'

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/paidUp-prod'
  },
  seedDB: false,
  cors : {
    enable : false,
    corsWhitelist : ['http://localhost:4000', 'https://admin.getpaidup.com', 'https://admstg.getpaidup.com', 'https://admdev.getpaidup.com']
  }
}
