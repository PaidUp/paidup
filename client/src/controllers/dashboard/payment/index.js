'use strict'
var app = require('angular').module('paidUpApp')

app.controller('PaymentLayoutCtrl', require('./paymentLayoutCtrl'))
app.controller('FindOrganizationCtrl', require('./findOrganizationCtrl'))
app.controller('PaymentPlanCtrl', require('./paymentPlanCtrl'))
app.controller('PaymentDoneCtrl', require('./paymentDoneCtrl'))

