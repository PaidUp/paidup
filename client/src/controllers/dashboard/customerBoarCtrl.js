'use strict'

module.exports = [ '$scope', '$rootScope', '$state', 'ProductService', function ($scope, $rootScope, $state, ProductService) {
  $scope.init = function () {
  }
  ProductService.saveProductSuggest();
}]