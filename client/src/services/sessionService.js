'use strict'

module.exports = [ '$rootScope', '$cookies', function ($rootScope, $cookies) {
  var SessionService = this
  $rootScope.$on('logout', function () {
    SessionService.removeCurrentSession()
  })

  this.addSession = function (data) {
    $cookies.put('token', data.token)
  }

  this.removeCurrentSession = function () {
    $cookies.remove('token')
  }

  this.getCurrentSession = function () {
    return $cookies.get('token')
  }

  this.setReferringDomain = function(url){
    $cookies.put('referring_domain', url)
  }

  this.getReferringDomain = function(){
    return $cookies.get('referring_domain')
  }

  this.setReferringLogo = function(url){
    $cookies.put('referring_logo', url)
  }

  this.getReferringLogo = function(){
    return $cookies.get('referring_logo')
  }
}]
