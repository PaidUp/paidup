'use strict'
var app = require('angular').module('paidUpApp')

app.factory('LoginService', require('./loginService'))
app.service('UserService', require('./userService'))
app.service('SessionService', require('./sessionService'))
app.factory('AuthService', require('./authService'))
app.service('TrackerService', require('./trackerService'))
app.factory('SingUpService', require('./singUpService'))
