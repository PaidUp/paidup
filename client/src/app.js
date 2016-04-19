'use strict'

var angular = require('angular')
require('../js/vendor/angular-facebook')
var paidUpApp = angular.module('paidUpApp', [require('angular-ui-router'), require('angular-resource'), require('angular-cookies'), 'facebook'])
paidUpApp.config(require('./paidUpAppConfig'))

// one require statement per sub directory instead of One per fil
require('./services')
require('./controllers')
