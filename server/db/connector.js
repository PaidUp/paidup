'use strict'

const MongoClient = require('mongodb').MongoClient;
const url = require('../config/environment').mongo.uri;

exports.db = function(cb){
    MongoClient.connect(url, function(err, db) {
        if(err){
            return cb(err);
        }
    console.log("Connected successfully to server");
    return cb(null, db);
});
};