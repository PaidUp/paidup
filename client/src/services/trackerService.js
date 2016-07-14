'use strict'
var angular = require('angular')

module.exports = ['ApplicationConfigService', '$mixpanel', function (ApplicationConfigService, $mixpanel) {

  var TrackerService = this

  TrackerService.track = function (msg, data){
    try{
      $mixpanel.track(msg, data);
    }catch (e){
      console.log(e)
    }
  }

  TrackerService.identify = function (id){
    try{
      $mixpanel.identify(id);
    }catch (e){
      console.log(e)
    }
  }

  TrackerService.peopleSet = function (obj){
    try{
      $mixpanel.people.set(obj);
    }catch (e){
      console.log(e)
    }
  }

  TrackerService.register = function (obj){
    try{
      $mixpanel.register(obj);
    }catch (e){
      console.log(e)
    }
  }
}]
