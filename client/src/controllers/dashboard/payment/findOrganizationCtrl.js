'use strict'

module.exports = ['$scope', '$rootScope', '$state', 'ProductService', 'SetupPaymentService', 'TrackerService', 'AuthService', 'CommerceService',
  function ($scope, $rootScope, $state, ProductService, SetupPaymentService, TrackerService, AuthService, CommerceService) {
    $scope.clickAccount = function () {
      $rootScope.$emit ('openAccountsMenu')
    }

    $rootScope.$emit ('changePaymentStep', 1)

    $scope.allCategories = [];
    $scope.filteredCategories = [];
    $scope.search = {name: ""};

    function findOrg(cb){
      ProductService.retrieveCategories ().then (function (resp) {
        $scope.allCategories = resp.categories.filter (function (product) {
          return product.isActive
        });

        if(Object.keys (ProductService.getPnProducts()).length > 0){
          $scope.filteredCategories = $scope.allCategories.filter(function (product) {
            var match = false;
            for (var key in ProductService.getPnProducts ()) {
              if (!match) {
                match = (key === product._id && product.isActive)
              }
            }
            return match;
          });
          cb (null, true);
        } else {
          loadPreviousCategories ($scope.allCategories, function (err, res) {
            if (err) {
              return cb (err)
            }
            cb (null, true);
          })
        }

      }).catch (function (err) {
        $rootScope.GlobalAlertSystemAlerts.push ({msg: 'No search results', type: 'warn', dismissOnTimeout: 5000})
        console.log ('findOrg err', err)
        cb (err);
      });
    }

    $scope.selectCategory = function (category) {
      SetupPaymentService.categorySelected = category;
      $state.go('dashboard.payment.plan');
      TrackerService.track ('Select Organization', {Org: category.name});
    }

    function loadPreviousCategories (allCategories, cb) {
      AuthService.getCurrentUserPromise ().then (function (user) {
        CommerceService.orderGet (user._id, 20, -1).then (function (orders) {
          $scope.filteredCategories = allCategories.filter (function (category) {
            var result = false;
            orders.body.orders.forEach (function (ele, idx, arr) {
              if (category._id === ele.paymentsPlan[0].productInfo.organizationId) {
                result = true;
              }
            });
            return result;
          })
          cb (null, true)
        }).catch (function (err) {
          cb (err)
          console.log ('err', err)
        })
      }).catch (function (err) {
        cb (err)
        console.log ('err', err)
      })
    }


    $scope.init = function () {
      $rootScope.$emit ('accountMenuReset')
      $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
      $scope.loading = true;
      findOrg (function (err, data) {
        $scope.loading = false;

      })
    }
  }]
