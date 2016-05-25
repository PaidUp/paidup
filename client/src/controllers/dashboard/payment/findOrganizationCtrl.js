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
      $scope.categories = resp.categories.filter(filter);
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

  var filterMethods = {
    isPnProduct : function(product){
      var match = false;
      for (var key in ProductService.getPnProducts()) {
        if(!match){
          match = (key === product._id && product.isActive)
        }

      }
      return match;
    },
    isActive: function(product){
      return product.isActive
    }
  }

  function filter(category){
    var pnProducts = ProductService.getPnProducts();
    if(pnProducts !== null && typeof pnProducts === 'object' && Object.keys(pnProducts).length > 0){
      return filterMethods.isPnProduct(category);
    } else {
      return filterMethods.isActive(category);
    }
  }

  $scope.selectCategory = function(category){
    SetupPaymentService.categorySelected  = category;
  }

  $scope.init = function(){
    $rootScope.$emit('accountMenuReset')
    $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
    $scope.loading = true;
    findOrg (function(){
      $scope.loading = false;
    })
  }
}]
