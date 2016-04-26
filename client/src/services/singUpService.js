'use strict'
var angular = require('angular')

module.exports = [ 'AuthService', 'UserService', '$q', function (AuthService, UserService, $q) {
  var user = {}

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
    user.info.isParent = true
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
    createPersonalAccountFacebook: createPersonalAccountFacebook,
    createBusinessAccount: createBusinessAccount,
    saveBusinessInfo: saveBusinessInfo,
    saveBusinessOrganization: saveBusinessOrganization,
    saveBusinessBank: saveBusinessBank,
    setFacebookSingUp: setFacebookSingUp,
    getFacebookSingUp: getFacebookSingUp
  }
}]
