'use strict'

module.exports = [ '$rootScope', '$q', 'SessionService', '$location', function ($rootScope, $q, SessionService, $location) {
  return {
    // Add authorization token to headers
    request: function (config) {
      config.headers = config.headers || {}
      if (SessionService.getCurrentSession()) {
        config.headers.Authorization = 'Bearer ' + SessionService.getCurrentSession()
      }
      return config
    },

    // Intercept 401s and redirect you to login
    responseError: function (response) {
      if (response.status === 401) {
        // due to circular dependency i can't add AuthService or CartService so
        // i need to make a logout event broadcast
        $rootScope.$emit('logout', {})
        $location.path('/')
        // remove any state tokens
        return $q.reject(response)
      } else if (response.status === 503) {
        $location.path('/')
        return $q.reject(response)
      } else {
        return $q.reject(response)
      }
    }
  }
}]
