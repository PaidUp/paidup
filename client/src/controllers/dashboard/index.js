'use strict'
var app = require('angular').module('paidUpApp')

app.controller('DashboardCtrl', require('./dashboardCtrl'))
app.controller('AccountBoxCtrl', require('./accountBoxCtrl'))
app.controller('RecentBoxCtrl', require('./recentBoxCtrl'))

