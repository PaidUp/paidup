'use strict'

module.exports = [ function () {
  var user = {}
  function setType (type) {
    user.type = type
  }
  function getType () {
    return user.type
  }

  return {
    setType: setType,
    getType: getType
  }
}]
