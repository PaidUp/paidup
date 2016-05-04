'use strict'
// var angular = require('angular')

module.exports = [ function () {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
      'show': '=',
      'modalTitle': '@?'
    },
    templateUrl: '/templates/directives/modal.window.html'
  }
}]
