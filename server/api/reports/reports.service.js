'use strict'

var commerceConnector = require('paidup-commerce-connect')
var config = require('../../config/environment/index')
const logger = require('../../config/logger')

function revenueProjection(filter, cb){
    let req = {
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    filter: filter
  }

  commerceConnector.reportRevenueProjection(req).exec({
    error: function(err){
      return cb(err);
    },
    success: function result(result){
      return cb(null, result.body);
    }
  });
    
};

function revenue(filter, cb){
    let req = {
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    filter: filter
  }

  commerceConnector.reportRevenue(req).exec({
    error: function(err){
      return cb(err);
    },
    success: function result(result){
      return cb(null, result.body);
    }
  });
    
};

module.exports = function (conf) {
  if (conf) {
    logger.debug('set new configuration', conf)
    config = conf
  }

  return {
    revenueProjection: revenueProjection,
    revenue: revenue
  }
}