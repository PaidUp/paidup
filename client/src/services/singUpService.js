'use strict'
var angular = require('angular')

module.exports = [ function () {
  var user = {}

  function setType (type) {
    user.type = type
  }

  function getType () {
    return user.type
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

  return {
    setType: setType,
    getType: getType,
    setReferralCode: setReferralCode,
    getReferralCode: getReferralCode,
    isValidSession: isValidSession,
    runFormControlsValidation: runFormControlsValidation
  }
}]
