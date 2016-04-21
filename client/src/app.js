'use strict'

var angular = require('angular')
require('angular-ui-router')
require('angular-resource')
require('angular-cookies')
require('../js/vendor/angular-facebook')
require('angulartics')
require('angulartics-google-analytics')

var paidUpApp = angular.module('paidUpApp', [
  'ui.router',
  'ngResource',
  'ngCookies',
  'facebook',
  'angulartics',
  'angulartics.google.analytics' ])

paidUpApp.config(require('./paidUpAppConfig'))

// one require statement per sub directory instead of One per file
require('./services')
require('./controllers')
