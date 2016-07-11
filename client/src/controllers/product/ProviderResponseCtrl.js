'use strict'

module.exports = ['$scope', '$state', 'OrganizationService', function ($scope, $state, OrganizationService) {
  OrganizationService.providerResponse($state.params.id).then(function (data) {
  }).catch(function (err) {
    console.log('ERROR', err)
    $scope.error = err
  })
  // http://localhost:9000/commerce/provider/response/5727c5f7c75e98b6345c60dc
}]
