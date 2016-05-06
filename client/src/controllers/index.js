'use strict'
var app = require('angular').module('paidUpApp')

app.controller('AppCtrl', require('./appCtrl'))
app.controller('LoginCtrl', require('./loginCtrl'))
require('./signUp')
require('./dashboard')
require('./product')
