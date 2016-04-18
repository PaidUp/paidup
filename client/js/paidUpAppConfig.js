'use strict'

module.exports = function ($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise('/state1')
  //
  // Now set up the states
  $stateProvider
  .state('state1', {
    url: '/state1',
    templateUrl: '../templates/state1.html'
  })
}

