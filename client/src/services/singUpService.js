'use strict'
var angular = require('angular')

module.exports = [ 'AuthService', 'UserService', function (AuthService, UserService) {
  var user = {}

  function setType (type) {
    user.type = type
  }

  function getType () {
    return user.type
  }

  function getUser () {
    return user
  }

  function setReferralCode (code) {
    user.referralCode = code
  }

  function getReferralCode () {
    return user.referralCode
  }

  function isValidSession () {
    return (
    angular.isDefined(user.type)
    )
  }

  function runFormControlsValidation (form) {
    angular.forEach(form, function (obj) {
      if (angular.isDefined(obj) && angular.isDefined(obj.$validate)) {
        obj.$validate()
        obj.$setTouched()
      }
    })
    return
  }

  function setCredentials (u) {
    user.credentials = {}
    user.credentials.email = u.email
    user.credentials.password = u.password1
    user.credentials.rememberMe = true
    return
  }

  function createPersonalAccount (u) {
    user.info = {}
    user.info.firstName = u.firstName
    user.info.lastName = u.lastName
    user.info.isParent = true
    user.address = {}
    user.address.type = 'shipping'
    user.address.label = 'shipping'
    user.address.country = 'USA'
    user.address.address1 = u.streetAddress
    user.address.address2 = ''
    user.address.city = u.city
    user.address.state = u.state
    user.address.zipCode = u.zipCode
    user.phoneInfo = {
      label: 'shipping',
      type: 'telephone',
      value: u.phone
    }
    var error = function (err) {
      // $scope.error = err.message
      // TrackerService.create('signup error' , {
      //   firstName: $scope.user.firstName,
      //   lastName: $scope.user.lastName,
      //   email: $scope.user.email,
      //   errorMessage: err.message
      // })
      return err
    }

    AuthService.createUser(
      user.info,
      function (newUser) {
        var newUserId = newUser.userId
        console.log('userCreated')
        // Account created - Linking Credentials
        AuthService.addCredentials(newUserId, user.credentials, function () {
          AuthService.login(user.credentials, function () {
            user.address.userId = newUserId
            // UserService.createAddress(user.address).then(function (data) {
            //   console.log('addresscreated')
            // }).catch(error)
            user.phoneInfo.userId = newUserId
            UserService.createContact(user.phoneInfo).then(function (data) {
              return 'success'
            }).catch(error)
          }, error)
          // Linking Address
          // user.address.userId = newUserId
          // UserService.createContact(user.phoneInfo).then(function (data) {
          //   return 'success'
          // }).catch(error)

        //   TrackerService.create('signup success', {
        //     firstName: $scope.user.firstName,
        //     lastName: $scope.user.lastName,
        //     email: $scope.user.email,
        //     roleType: $scope.showRole ? 'Payer' : 'Payee'
        //   })
        }, error)
      }, error)
  }

  function saveBusinessInfo (u) {
    user.info = {}
    user.info.firstName = u.firstName
    user.info.lastName = u.lastName
    user.info.isParent = false
    user.info.dateOfBirth = u.dateOfBirth
    user.info.SSN = u.SSN
    user.address = {}
    user.address.type = 'shipping'
    user.address.label = 'shipping'
    user.address.country = 'USA'
    user.address.address1 = u.streetAddress
    user.address.address2 = ''
    user.address.city = u.city
    user.address.state = u.state
    user.address.zipCode = u.zipCode
    user.phoneInfo = {
      label: 'shipping',
      type: 'telephone',
      value: u.phone
    }
    return user
  }

  function saveBusinessOrganization (u) {
    user.business = {}
    user.business.type = u.businessType
    user.business.name = u.businessName
    user.business.EIN = u.EIN
    return user
  }

  function saveBusinessBank (u) {
    user.bank = {}
    user.bank.routingNumber = u.routingNumber
    user.bank.accountNumber = u.accountNumber
    return user
  }

  function createBusinessAccount () {
    return ''
  }

  return {
    getUser: getUser,
    setType: setType,
    getType: getType,
    setReferralCode: setReferralCode,
    getReferralCode: getReferralCode,
    isValidSession: isValidSession,
    runFormControlsValidation: runFormControlsValidation,
    setCredentials: setCredentials,
    createPersonalAccount: createPersonalAccount,
    saveBusinessInfo: saveBusinessInfo,
    saveBusinessOrganization: saveBusinessOrganization,
    saveBusinessBank: saveBusinessBank,
    createBusinessAccount: createBusinessAccount
  }
}]
