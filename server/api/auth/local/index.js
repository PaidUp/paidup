'use strict'

const express = require('express')
const tdAuthService = require('TDCore').authService
const config = require('../../../config/environment')

const router = express.Router()

router.post('/signup', function (req, res, next) {
  tdAuthService.init(config.connections.user)
  tdAuthService.signup(req.body, function (err, data) {
    if (err) res.status(402).json(err)
    res.status(200).json(data)
  })
})

router.post('/login', function (req, res, next) {
  tdAuthService.init(config.connections.user)
  tdAuthService.login(req.body, function (err, data) {
    if(err && err.message === 'This email is not registered.'){
      return res.status(403).json(err)
    } 
    if (err && err.message === 'This password is not correct.') {
      return res.status(401).json(err)
    } 
    if (err){
      return res.status(402).json(err)
    }
    res.status(200).json(data)
  })
})

module.exports = router
