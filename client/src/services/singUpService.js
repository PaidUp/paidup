'use strict'
var angular = require('angular')

module.exports = [ 'AuthService', 'UserService', 'OrganizationService', '$q', function (AuthService, UserService, OrganizationService, $q) {
  var user = {}
  var organization = {}

  function setType (type) {
    user.type = type
  }

  function getType () {
    return user.type
  }

  function setFacebookSingUp (facebookSingUp) {
    user.facebookSingUp = facebookSingUp
  }

  function getFacebookSingUp () {
    return user.facebookSingUp
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

  // Internal helper
  function completePersonalUserInfo (u) {
    user.info = {}
    user.info.firstName = u.firstName
    user.info.lastName = u.lastName
    user.info.isParent = true // TODO -> set if user is personal or business.
    AuthService.setParent(true)
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
  }

  function createBillingAddress (billingAddress) {
    return $q(function (resolve, reject) {
      var bAddress = {}
      bAddress.type = 'billing'
      bAddress.label = 'billing'
      bAddress.country = 'USA'
      bAddress.address1 = billingAddress.streetAddress
      bAddress.address2 = ''
      bAddress.city = billingAddress.city
      bAddress.state = billingAddress.state
      bAddress.zipCode = billingAddress.zipCode
      var error = function (err) {
        reject(err)
      }
      var currentUser = AuthService.getCurrentUser()
      bAddress.userId = currentUser._id
      UserService.createAddress(bAddress).then(function () {
        resolve('success')
      }).catch(error)
    })
  }

  function createPersonalAccountFacebook (u) {
    return $q(function (resolve, reject) {
      completePersonalUserInfo(u)
      // TO DO: Check if names are different
      var error = function (err) {
        reject(err)
      }
      var currentUser = AuthService.getCurrentUser()
      user.address.userId = currentUser._id
      UserService.createAddress(user.address).then(function () {
        user.phoneInfo.userId = currentUser._id
        UserService.createContact(user.phoneInfo).then(function () {
          resolve('success')
        }).catch(error)
      }).catch(error)
    })
  }

  function createPersonalAccount (u) {
    return $q(function (resolve, reject) {
      completePersonalUserInfo(u)
      var error = function (err) {
        reject(err)
      }
      AuthService.createUser(
        user.info,
        function (newUser) {
          var newUserId = newUser.userId
          // Account created - Linking Credentials
          AuthService.addCredentials(newUserId, user.credentials, function () {
            user.address.userId = newUserId
            UserService.createAddress(user.address).then(function () {
              user.phoneInfo.userId = newUserId
              UserService.createContact(user.phoneInfo).then(function () {
                resolve('success')
              }).catch(error)
            }).catch(error)
          }, error)
        }, error)
    })
  }

  function saveBusinessInfo (u) {
    organization = {}
    organization.firstName = u.firstName
    organization.lastName = u.lastName
    organization.dateOfBirth = u.dateOfBirth
    organization.SSN = u.SSN
    organization.address = {}
    // organization.address.type = 'shipping'
    // organization.address.label = 'shipping'
    organization.address.country = 'USA'
    organization.address.address1 = u.streetAddress
    organization.address.address2 = ''
    organization.address.city = u.city
    organization.address.state = u.state
    organization.address.zipCode = u.zipCode
    return organization
  }

  function saveBusinessOrganization (u) {
    organization.business = {}
    organization.business.type = u.businessType
    organization.business.name = u.businessName
    organization.business.EIN = u.EIN
    return organization
  }

  function saveBusinessBank (u) {
    organization.bank = {}
    organization.bank.routingNumber = u.routingNumber
    organization.bank.accountNumber = u.DDA1
    return organization
  }

  function createBusinessAccount () {
    return $q(function (resolve, reject) {
      var error = function (err) {
        reject(err)
      }
      OrganizationService.organizationRequest(
        organization,
        function (newUser) {
          var newUserId = newUser.userId
          AuthService.addCredentials(newUserId, user.credentials, function () {
            user.address.userId = newUserId
            UserService.createAddress(user.address).then(function () {
              user.phoneInfo.userId = newUserId
              UserService.createContact(user.phoneInfo).then(function () {
                resolve('success')
              }).catch(error)
            }).catch(error)
          }, error)
        }, error)
    })
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
    createPersonalAccountFacebook: createPersonalAccountFacebook,
    createBusinessAccount: createBusinessAccount,
    saveBusinessInfo: saveBusinessInfo,
    saveBusinessOrganization: saveBusinessOrganization,
    saveBusinessBank: saveBusinessBank,
    setFacebookSingUp: setFacebookSingUp,
    getFacebookSingUp: getFacebookSingUp,
    createBillingAddress: createBillingAddress
  }
}]
