'use strict'

module.exports = [ '$scope', '$rootScope', '$state', 'ProductService', 'PaymentService', function ($scope, $rootScope, $state, ProductService, PaymentService) {
  $scope.clickAccount = function () {
    $rootScope.$emit('openAccountsMenu')
  }

  $scope.categories = [];
  $scope.search = {name:""};


  $scope.findOrg = function(){
    ProductService.retrieveCategories().then(function(resp){
      $scope.categories = resp.categories;

    }).catch(function(err){
      console.log('findOrg err', err)
    });
  }

  $scope.selectCategory = function(category){
    PaymentService.setCategorySelected(category);
  }

  $scope.init = function(){

  }
}]
