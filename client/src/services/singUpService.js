'use strict'
var angular = require('angular')

module.exports = [ 'AuthService', 'UserService', 'OrganizationService', '$q', 'properCaseFilter', function (AuthService, UserService, OrganizationService, $q, properCaseFilter) {
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
        obj.$setTouched()
        obj.$validate()
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
    user.info.firstName = properCaseFilter(u.firstName)
    user.info.lastName = properCaseFilter(u.lastName)
    user.info.isParent = getType() !== 'business'
    AuthService.setParent(getType() !== 'business')
    user.address = {}
    user.address.type = 'shipping'
    user.address.label = 'shipping'
    user.address.country = 'USA'
    user.address.address1 = properCaseFilter(u.streetAddress)
    user.address.address2 = ''
    user.address.city = properCaseFilter(u.city)
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
      bAddress.address1 = properCaseFilter(billingAddress.streetAddress)
      bAddress.address2 = ''
      bAddress.city = properCaseFilter(billingAddress.city)
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
      user.id = currentUser._id
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
          user.id = newUserId
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
    organization.ownerFirstName = properCaseFilter(u.firstName)
    organization.ownerLastName = properCaseFilter(u.lastName)
    organization.ownerDOB = u.dateOfBirth
    organization.ownerSSN = u.SSN
    organization.country = 'US'
    organization.Address = properCaseFilter(u.streetAddress)
    organization.AddressLineTwo = ''
    organization.city = properCaseFilter(u.city)
    organization.state = u.state
    organization.zipCode = u.zipCode
    return organization
  }

  function saveBusinessOrganization (u) {
    organization.businessType = u.businessType
    organization.businessName = u.businessName
    organization.EIN = u.EIN
    return organization
  }

  function saveBusinessBank (u) {
    organization.aba = u.routingNumber
    organization.dda = u.DDA1
    return organization
  }

  function createBusinessAccount () {
    return $q(function (resolve, reject) {
      var error = function (err) {
        reject(err)
      }
      organization.ownerPhone = user.phoneInfo.value
      organization.ownerEmail = user.credentials.email
      organization.referralCode = user.referralCode
      OrganizationService.organizationRequest(
        organization,
        user.id).then(function (organization) {
          resolve(organization.organizationId)
        }).catch(error)
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
