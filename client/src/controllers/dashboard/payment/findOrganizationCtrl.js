'use strict'

module.exports = [ '$scope', '$rootScope', '$state', 'ProductService', 'SetupPaymentService', function ($scope, $rootScope, $state, ProductService, SetupPaymentService) {
  $scope.clickAccount = function () {
    $rootScope.$emit('openAccountsMenu')
  }


  $rootScope.$emit('changePaymentStep', 1)


  $scope.categories = [];
  $scope.search = {name:""};


  function findOrg (cb){
    ProductService.retrieveCategories().then(function(resp){
      $scope.categories = resp.categories;
      if(!$scope.categories || !$scope.categories.length){
        $rootScope.GlobalAlertSystemAlerts.push({msg: 'No search results', type: 'info', dismissOnTimeout: 5000})
      }
      cb();
    }).catch(function(err){
      $rootScope.GlobalAlertSystemAlerts.push({msg: 'No search results', type: 'warn', dismissOnTimeout: 5000})
      console.log('findOrg err', err)
      cb();
    });
  }

  $scope.selectCategory = function(category){
    SetupPaymentService.setCategorySelected(category);
  }

  $scope.init = function(){
    $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
    $scope.loading = true;
    findOrg (function(){
      $scope.loading = false;
    })
  }
}]
