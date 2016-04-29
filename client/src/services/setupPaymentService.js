'use strict'
// var angular = require('angular')

module.exports = [ 'AuthService', 'UserService', '$q', function (AuthService, UserService, $q) {
  function getString () {
    return '22222222222'
  }

  return {
    getString: getString
  }
}]
