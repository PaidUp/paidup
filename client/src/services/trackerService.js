'use strict'
var angular = require('angular')

module.exports = ['$analytics', function ($analytics) {

  var TrackerService = this

  TrackerService.track = function (msg, data){
    $analytics.eventTrack(msg, data);
  }

  TrackerService.identify = function (id){
    $analytics.setUsername(id)
  }

  TrackerService.peopleSet = function (obj){
    $analytics.setUserProperties(obj);
  }

  TrackerService.register = function (obj){
    $analytics.setSuperProperties(obj);
  }
}]
