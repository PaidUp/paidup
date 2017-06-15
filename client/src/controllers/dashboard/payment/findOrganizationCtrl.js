'use strict'

module.exports = ['$scope', '$rootScope', '$state', 'ProductService', 'SetupPaymentService', 'TrackerService', 'AuthService', 'CommerceService', '$location',
  function ($scope, $rootScope, $state, ProductService, SetupPaymentService, TrackerService, AuthService, CommerceService, $location) {
    $scope.clickAccount = function () {
      $rootScope.$emit('openAccountsMenu')
    }

    $rootScope.$emit('changePaymentStep', 1)

    $scope.allCategories = [];
    $scope.filteredCategories = [];
    $scope.search = { name: "" };

    function findOrg(cb) {
      ProductService.retrieveCategories().then(function (resp) {
        $scope.allCategories = resp.categories.filter(function (product) {
          return product.isActive
        });
        ProductService.categories = $scope.allCategories;
        ProductService.getPnProducts(function (errPn, pnProducts) {
          if(errPn){
            return cb(errPn)
          }
          if(pnProducts.length > 0){
            $scope.filteredCategories = $scope.allCategories.filter(function (product) {
              var match = false;
              pnProducts.forEach(function(pnProduct){
                if (!match) {
                  match = (pnProduct.category === product._id && product.isActive)
                }
              })
              return match;
            })
            cb(null, true);
          } else {
            loadPreviousCategories($scope.allCategories, function (err, res) {
              if (err) {
                return cb(err)
              }
              cb(null, true);
            })
          }
        });
      }).catch(function (err) {
        $rootScope.GlobalAlertSystemAlerts.push({ msg: 'No search results', type: 'warn', dismissOnTimeout: 5000 })
        cb(err);
      });
    }

    $scope.selectCategory = function (category) {
      SetupPaymentService.categorySelected = category;
      $scope.hideCategories = true;
      $scope.loading = true;
      TrackerService.track('Select Organization', { Org: category.name });
    }

    function loadPreviousCategories(allCategories, cb) {
      AuthService.getCurrentUserPromise().then(function (user) {
        CommerceService.orderGet(user._id, 20, -1).then(function (orders) {
          $scope.filteredCategories = allCategories.filter(function (category) {
            var result = false;
            orders.body.orders.forEach(function (ele, idx, arr) {
              if (category._id === ele.paymentsPlan[0].productInfo.organizationId) {
                result = true;
              }
            });
            return result;
          })
          cb(null, true)
        }).catch(function (err) {
          cb(err)
          console.log('err', err)
        })
      }).catch(function (err) {
        cb(err)
        console.log('err', err)
      })
    }

    $scope.init = function () {
      $scope.hideCategories = false;
      $rootScope.$emit('accountMenuReset')
      $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
      $scope.loading = true;
      findOrg(function (err, data) {
        $scope.loading = false;

      })
    }
  }]
