'use strict'

const MongoClient = require('mongodb').MongoClient;
const url = require('../config/environment').mongo.uri;

function handlerDB(cb) {
    if (handlerDB.db && handlerDB.db.serverConfig && handlerDB.db.serverConfig.isConnected()) {
        console.log('@@@ old instance')
        return cb(null, handlerDB.db);
    }
    MongoClient.connect(url, function (err, db) {
        if (err) {
            return cb(err);
        }
        console.log("Connected successfully to server");
        handlerDB.db = db;
        cb(null, handlerDB.db)
    });
}

exports.db = function (cb) {
    handlerDB(cb)
};