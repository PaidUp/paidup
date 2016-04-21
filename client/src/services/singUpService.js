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

  return {
    setType: setType,
    getType: getType,
    setReferralCode: setReferralCode,
    getReferralCode: getReferralCode,
    isValidSession: isValidSession
  }
}]
