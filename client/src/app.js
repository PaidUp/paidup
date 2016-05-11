'use strict'

var angular = require('angular')
require('angular-ui-router')
require('angular-resource')
require('angular-sanitize')
require('angular-cookies')
require('angular-translate')
require('./vendor/angular-facebook')
require('./vendor/alert.min')
require('angulartics')
require('angulartics-google-analytics')
require('angular-ui-mask')

var paidUpApp = angular.module('paidUpApp', [
  'ui.router',
  'ngResource',
  'ngSanitize',
  'ngCookies',
  'pascalprecht.translate',
  'facebook',
  'angulartics',
  'angulartics.google.analytics',
  'ui.mask',
  'ui.bootstrap' ])

paidUpApp.config(require('./appConfig'))
paidUpApp.run(require('./appRun'))

// one require statement per sub directory instead of One per file
require('./services')
require('./controllers')
require('./directives')
require('./filters')
