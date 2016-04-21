'use strict'
var app = require('angular').module('paidUpApp')

app.controller('AppCtrl', require('./appCtrl'))
app.controller('LoginCtrl', require('./loginCtrl'))
require('./singUp')
require('./dashboard')
