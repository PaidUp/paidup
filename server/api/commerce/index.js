'use strict'

const express = require('express')
const router = express.Router()
const http = require('http')

router.use('/cart', require('./cart/index'))
router.use('/catalog', require('./catalog/index'))
router.use('/order', require('./order/index'))
router.use('/dues', require('./dues/index'))

// temporal link...while PuProduct is completed.
router.use('/provider/response/:id', function (req, resp) {
  http.get('http://localhost:9100/api/v1/commerce/provider/response/' + req.params.id, (res) => {
    let dataResponse
    res.on('data', (chunk) => {
      console.log(`data BODY: ${chunk}`)
      dataResponse = chunk
    })
    res.on('end', () => {
      return resp.status(200).json({'response': dataResponse})
    })
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`)
    return resp.status(200).json({'err': e.message})
  })
})

module.exports = router
