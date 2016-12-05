'use strict'

var angular = require('angular')
require('angular-ui-router')
require('angular-resource')
require('angular-sanitize')
require('angular-cookies')
require('angular-translate')
require('angular-animate')
require('./vendor/angular-facebook')
require('./vendor/dynamic-forms')
//require('./vendor/olark-config')
require('./vendor/adroll')
// require('./vendor/alert.min')
require('./vendor/mixpanel')
//require('./vendor/angular-mixpanel')
require('angular-ui-bootstrap')
require('angulartics')
require('angulartics-google-analytics')
require('angular-ui-mask')
require('angular-local-storage')
require('angulartics-mixpanel')
require('ng-csv')

var paidUpApp = angular.module('paidUpApp', [
  'ui.router',
  'ngResource',
  'ngSanitize',
  'ngCookies',
  'ngAnimate',
  'pascalprecht.translate',
  'facebook',
  'angulartics',
  'angulartics.google.analytics',
  'ui.mask',
  'LocalStorageModule',
  'ui.bootstrap',
  'dynform',
  'angulartics.mixpanel',
  'ngCsv'
])

paidUpApp.config(require('./appConfig'))
paidUpApp.run(require('./appRun'))

// one require statement per sub directory instead of One per file
require('./services')
require('./controllers')


require('./directives')
require('./filters')

// This OVerrides the templates for Bootstrap UI Plugins.
// They basically adds the bootstrap-styles  Class and Replace the Glyphicons with Font Awesome icons
require('./bootstrap-template-overrides')
