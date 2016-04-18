'use strict'

module.exports = [ '$log', function ($log) {
  function internal () {
    return 'AAAAAAAAAAAAAAAAAAAA'
  }

  return {
    greet: internal
  }
}]
