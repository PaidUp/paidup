'use strict'

const config = require('../../../config/environment')
const tdCommerceService = require('TDCore').commerceService;
const PaidUpProductConnect = require('paidup-product-connect');
const schedule = require('node-schedule');

var service = this;

function catalogList(categoryId, cb) {
  tdCommerceService.init(config.connections.commerce)
  tdCommerceService.catalogCategoryV2(categoryId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function groupedList(productId, cb) {
  tdCommerceService.init(config.connections.commerce)
  tdCommerceService.catalogProductV2(productId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function catalogProduct(productId, cb) {
  tdCommerceService.init(config.connections.commerce)
  tdCommerceService.catalogProduct(productId, function (err, data) {
    if (err) return cb(err)
    return cb(null, data)
  })
}

function catalogCreate(productData, cb) {
  tdCommerceService.init(config.connections.commerce)
  tdCommerceService.catalogCreate(productData, function (err, product) {
    if (err) return cb(err)
    return cb(null, product)
  })
}

function startCronCleanCategories(){
  service.clearCategoriesCache(function(err, data){
    console.log('start cron clean categories');
  })
  service.getCategories.scheduleCategories = schedule.scheduleJob('30 6 * * *', function(){
    service.clearCategoriesCache(function(err, data){
      console.log('categories cleaned');
    })
    
  });
}

function getCategories(cb) {
  if (!service.getCategories.categories) {

    //TODO when implement PUProduct this method must be update (get categories from puproduct)
    PaidUpProductConnect.categoryRetrieve({
      baseUrl: config.connections.commerce.baseUrl,
      token: config.connections.commerce.token,
    }).exec({
      // An unexpected error occurred.
      error: function (err) {
        cb(err)
      },
      // OK.
      success: function (categories) {
        service.getCategories.categories = JSON.parse(categories);
        cb(null, service.getCategories.categories);
      },
    });
  } else {
    cb(null, getCategories.categories);
  }
}

function clearCategoriesCache (cb){
  service.getCategories.categories = null;
  service.getCategories(function(err, data){
    if (err) {
      return cb(err)
    }
    cb(null, data)
  })
}

function getProduct(productId, cb) {
  //TODO when implement PUProduct this method must be update (get product from puproduct)
  PaidUpProductConnect.productRetrieve({
    baseUrl: config.connections.commerce.baseUrl,
    token: config.connections.commerce.token,
    productId: productId
  }).exec({
    // An unexpected error occurred.
    error: function (err) {
      cb(err)
    },
    // OK.
    success: function (product) {
      let resp = JSON.parse(product);
      cb(null, resp.body);
    },
  });
}

exports.catalogList = catalogList
exports.catalogProduct = catalogProduct
exports.catalogCreate = catalogCreate
exports.groupedList = groupedList
exports.getCategories = getCategories
exports.getProduct = getProduct
exports.clearCategoriesCache = clearCategoriesCache;
exports.startCronCleanCategories = startCronCleanCategories;

