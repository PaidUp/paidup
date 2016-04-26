'use strict'

module.exports = [ '$resource', '$cookieStore', function ($resource, $cookieStore) {
  var Config = $resource('/api/v1/application/config', {}, {})

  this.getConfig = function () {
    return Config.get().$promise
  }
}]
