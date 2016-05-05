'use strict'
var app = require('angular').module('paidUpApp')

app.service('UserService', require('./userService'))
app.service('SessionService', require('./sessionService'))
app.factory('AuthService', require('./authService'))
app.service('TrackerService', require('./trackerService'))
app.factory('SingUpService', require('./singUpService'))
app.service('PaymentService', require('./paymentService'))
app.service('CommerceService', require('./commerceService'))
app.service('OrganizationService', require('./organizationService'))
app.service('ApplicationConfigService', require('./appConfigService'))
app.factory('AuthInterceptor', require('./authInterceptor'))
app.factory('SetupPaymentService', require('./setupPaymentService'))
