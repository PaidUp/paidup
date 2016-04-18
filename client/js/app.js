'use strict'

var angular = require('angular')
var paidUpApp = angular.module('paidUpApp', [require('angular-ui-router')])
paidUpApp.config(require('./paidUpAppConfig'))

// one require statement per sub directory instead of One per file
require('./services')
require('./controllers')
