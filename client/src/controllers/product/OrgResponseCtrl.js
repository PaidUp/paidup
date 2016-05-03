'use strict'

module.exports = ['$scope', '$state', 'OrganizationService', function ($scope, $state, OrganizationService) {
  OrganizationService.organizationResponse($state.params.id).then(function (data) {
    // console.log('data.body', data.body)
  }).catch(function (err) {
    console.log('ERROR', err)
    $scope.error = err
  })
  // http://localhost:9000/product/organization/response/5727c5f7c75e98b6345c60dc
}]
