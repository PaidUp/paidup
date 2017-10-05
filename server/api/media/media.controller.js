'use strict'

const logger = require('../../config/logger')
const pmx = require('pmx')
const request = require('request')
const config = require('../../config/environment')

exports.getMagentoImage = function (req, res) {
  let file = req.query.file;
  var requestSettings = {
    url: 'https://'+config.commerce.magento.host+':8884/media/catalog/product'+file,
    method: 'GET',
    encoding: null
  };
  request(requestSettings.url).pipe(res);
}