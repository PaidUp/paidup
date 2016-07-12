'use strict'
var angular = require('angular')

module.exports = ['$location', 'ApplicationConfigService', function ($location, ApplicationConfigService) {

(function(e,b){if(!b.__SV){var a,f,i,g;window.mixpanel=b;b._i=[];b.init=function(a,e,d){function f(b,h){var a=h.split(".");2==a.length&&(b=b[a[0]],h=a[1]);b[h]=function(){b.push([h].concat(Array.prototype.slice.call(arguments,0)))}}var c=b;"undefined"!==typeof d?c=b[d]=[]:d="mixpanel";c.people=c.people||[];c.toString=function(b){var a="mixpanel";"mixpanel"!==d&&(a+="."+d);b||(a+=" (stub)");return a};c.people.toString=function(){return c.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms register register_once alias unregister identify name_tag set_config people.set people.set_once people.increment people.append people.union people.track_charge people.clear_charges people.delete_user".split(" ");
      for(g=0;g<i.length;g++)f(c,i[g]);b._i.push([a,e,d])};b.__SV=1.2;a=e.createElement("script");a.type="text/javascript";a.async=!0;a.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===e.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\/\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";f=e.getElementsByTagName("script")[0];f.parentNode.insertBefore(a,f)}})(document,window.mixpanel||[]);


  ApplicationConfigService.getConfig().then(function (data){
    try{
      mixpanel.init(data.mixpanelApiKey);
    }catch (e){
      console.log(e)
    }
  });

  var TrackerService = this

  TrackerService.track = function (msg, data){
    try{
      mixpanel.track(msg, data);
    }catch (e){
      console.log(e)
    }
  }

  TrackerService.identify = function (id){
    try{
      mixpanel.identify(id);
    }catch (e){
      console.log(e)
    }
  }

  TrackerService.peopleSet = function (obj){
    try{
      mixpanel.people.set(obj);
    }catch (e){
      console.log(e)
    }
  }

  TrackerService.register = function (obj){
    try{
      mixpanel.register(obj);
    }catch (e){
      console.log(e)
    }
  }
}]
