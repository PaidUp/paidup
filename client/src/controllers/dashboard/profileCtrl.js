'use strict'
var angular = require('angular')

module.exports = [ '$scope', 'UserService', 'TrackerService', 'AuthService', '$state', 'ProductService', '$rootScope', function ($scope, UserService, TrackerService, AuthService, $state, ProductService, $rootScope) {
  $scope.editName = false
  $scope.loading = false
  $scope.editPhone = false
  $scope.loader = '<i class="fa fa-circle-o-notch fa-spin"></i>'
  $scope.states = UserService.getStates()

  $scope.init = function () {
    AuthService.getCurrentUserPromise().then(function (user) {
      if(user.meta.getFrom){
        $state.go('dashboard.summary.components');
        return;
      }

      $scope.addresses = user.addresses
      $scope.contacts = user.contacts
      $scope.email = user.email
    }).catch(function (err) {
      console.log('err', err)
    })
    TrackerService.track('View Profile', {Role: AuthService.getRoleForTrack()})
  }

  $scope.updateName = function updateName () {
    $scope.loading = true
    UserService.updateUser({firstName: $scope.user.firstName, lastName: $scope.user.firstName, userId: $scope.user._id}).then(function (userUpd) {
      $scope.loading = false
      $scope.editName = false
      TrackerService.track('update Name Profile', {Role: AuthService.getRoleForTrack()})
    }).catch(function (err) {
      console.log('err', err)
      $scope.loading = false
    })
  }

  $scope.editingAddress = {}
  $scope.editAddress = function (address) {
    $scope.editingAddress = angular.copy(address)
    $scope.showAddressModal = true
  }
  $scope.saveAddress = function () {
    $scope.loading = true
    UserService.updateAddress($scope.editingAddress.addressId, $scope.editingAddress, $scope.user._id).then(function (addressUpd) {
      var newAdd = $scope.addresses.filter(function (add) {
        return add.addressId !== $scope.editingAddress.addressId
      })
      newAdd.push($scope.editingAddress)
      $scope.addresses = newAdd
      $scope.loading = false
      $scope.showAddressModal = false
      TrackerService.track('update Address Profile', {Role: AuthService.getRoleForTrack()})
    }).catch(function (err) {
      console.log('err', err)
      $scope.loading = false
    })
  }
  $scope.closeModal = function () {
    $scope.showAddressModal = false
  }
  $scope.inputEmail = ''
  $scope.updateEmail = function updateEmail () {
    $scope.loading = true
    AuthService.updateEmail($scope.inputEmail, $scope.user._id).then(function (emailUpd) {
      $scope.email = $scope.inputEmail
      $scope.loading = false
      $scope.editEmail = false
      TrackerService.track('update Email Profile', {Role: AuthService.getRoleForTrack()})
    }).catch(function (err) {
      console.log('err', err)
      $scope.loading = false
    })
  }
  $scope.updatePass = function updatePass () {
    $scope.loading = true
    AuthService.updatePassword($scope.inputOldPass, $scope.inputNewPass, $scope.user._id).then(function (passUpd) {
      $scope.loading = false
      $scope.editPass = false
      $scope.errPass = ''
      $scope.inputOldPass = ''
      $scope.inputNewPass = ''
      $scope.inputRFepeatNewPass = ''
      TrackerService.track('update Password Profile', {Role: AuthService.getRoleForTrack()})
    }).catch(function (err) {
      console.log('err', err)
      $scope.errPass = err.data.message
      $scope.loading = false
    })
  }
  $scope.validateUpdatePassword = function (f) {
    if (!angular.equals(f.newPass.$viewValue, f.repeatNewPass.$viewValue) || (f.newPass.$viewValue === undefined && f.repeatNewPass.$viewValue === undefined)) {
      f.repeatNewPass.$setValidity('match', false)
    } else {
      f.repeatNewPass.$setValidity('match', true)
    }
  }
  $scope.updatePhone = function updatePass (contact) {
    $scope.loading = true
    contact.userId = $scope.user._id
    // contact.value = $scope.inputContact
    UserService.contactUpdate(contact).then(function (contactUpd) {
      $scope.loading = false
      $scope.editPhone = false
      TrackerService.track('update Contact Profile', {Role: AuthService.getRoleForTrack()})
    }).catch(function (err) {
      console.log('err', err)
      $scope.loading = false
    })
  }
}]
