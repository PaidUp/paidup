'use strict'
/* global Stripe */

module.exports = [ '$scope', 'ApplicationConfigService', function ($scope, ApplicationConfigService) {
  ApplicationConfigService.getConfig().then(function (config) {
    Stripe.setPublishableKey(config.stripeApiPublic)
  })
}]
