'use strict'

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/convenience-dev'
  },
  seedDB: true,
  cors : {
    enable : true,
    corsWhitelist : ['http://localhost:4000', 'http://localhost:8080', 'https://admin.getpaidup.com', 'https://admstg.getpaidup.com', 'https://admdev.getpaidup.com']
  }
}
