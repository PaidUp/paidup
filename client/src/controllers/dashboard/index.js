'use strict'
var app = require('angular').module('paidUpApp')

app.controller('DashboardCtrl', require('./dashboardCtrl'))
app.controller('AccountsBoxCtrl', require('./accountsBoxCtrl'))
app.controller('NextPaymentBoxCtrl', require('./nextPaymentBoxCtrl'))
app.controller('RecentBoxCtrl', require('./recentBoxCtrl'))
app.controller('ActiveOrdersBoxCtrl', require('./activeOrdersBoxCtrl'))
app.controller('AccountsMenuCtrl', require('./accountsMenuCtrl'))
app.controller('MobileMenuCtrl', require('./mobileMenuCtrl'))
app.controller('HeaderCtrl', require('./headerCtrl'))
app.controller('ActivitiesCtrl', require('./activitiesCtrl'))

require('./payment')
