'use strict'

module.exports = [ '$resource', function ($resource) {
  var Config = $resource('/api/v1/application/config', {}, {})

  this.getConfig = function () {
    return Config.get().$promise
  }
}]
