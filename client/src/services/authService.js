'use strict'
var angular = require('angular')

module.exports = ['$rootScope', '$http', 'UserService', 'SessionService', 'Facebook', '$q', 'TrackerService', function ($rootScope, $http, UserService, SessionService, Facebook, $q, TrackerService) {
  var ROLES_ROUTES = {
    USER: 'athletes',
    COACH: 'provider-request',
    COACH_SUCCESS: 'provider-success',
    DEFAULT: 'main'
  }

  if (SessionService.getCurrentSession()) {
    $rootScope.currentUser = UserService.get(SessionService.getCurrentSession())
  }

  $rootScope.$on('logout', function () {
    delete $rootScope.currentUser
  })

  var dest = 'signup'
  var isParent = true
  var resetPass = false

  function getRoleForTracking() {
    var role = $rootScope.currentUser.roles[$rootScope.currentUser.roles.length - 1]
    var resp = 'unknown'
    switch (role) {
      case "user":
        resp = "Personal"
        break
      case "coach":
        resp = "Business"
        break
      default:
        resp = role
    }
    return resp
  }

  return {
    getresetPass: function () {
      return resetPass
    },

    setresetPass: function (value) {
      resetPass = value
    },

    getDest: function () {
      return dest
    },

    getIsParent: function () {
      return isParent
    },

    destPath: function (value, parent) {
      dest = value
      isParent = parent
    },

    setDest: function () {
      dest = 'signup'
    },

    setIsParent: function () {
      isParent = true
    },

    setParent: function (_isParent) {
      isParent = _isParent
    },

    updateCurrentUser: function () {
      $rootScope.currentUser = UserService.get(SessionService.getCurrentSession())
    },

    updateCurrentUserSync: function (cb) {
      UserService.get(SessionService.getCurrentSession()).$promise.then(function (user) {
        cb(user)
      })
    },

    /**
     * Authenticate user and save token
     *
     * @param  {Object}   user     - login info
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    login: function (user, successFn, errorFn) {
      var success = successFn || angular.noop
      var error = errorFn || angular.noop
      var context = this
      $http.post('/api/v1/auth/local/login', {
        email: user.email,
        password: user.password,
        rememberMe: user.rememberMe
      })
        .success(function (data) {
          SessionService.addSession(data)
          UserService.get(data.token, function (user) {
            $rootScope.currentUser = user
            success(user)
          })
        })
        .error(function (err) {
          context.logout()
          error(err)
          err.email = user.email
        })
    },

    /**
     * Delete access token and user info
     *
     * @param  {Function}
     */
    logout: function () {
      SessionService.removeCurrentSession()
      delete $rootScope.currentUser
    },

    authorize: function (data) {
      if (data.pageDataRoles) {
        return data.pageDataRoles.some(function (role) {
          return data.userRoles.indexOf(role) !== -1
        })
      }
    },

    reLocation: function (roles, providerState) {
      if (roles.indexOf('coach') !== -1) {
        if (providerState === 'pending') {
          return ROLES_ROUTES.COACH_SUCCESS
        } else {
          return ROLES_ROUTES.COACH
        }
      } else if (roles.indexOf('user') !== -1) {
        return ROLES_ROUTES.USER
      } else {
        return ROLES_ROUTES.DEFAULT
      }
    },

    loginFacebook: function (successFn, errorFn) {
      var success = successFn || angular.noop
      var error = errorFn || angular.noop
      var loginSuccess = function (user) {
        if (user.status === 'not_authorized') {
          error('User authorization denied')
          return
        }
        if (!user.authResponse) {
          error('user.authResponse undefined')
          return
        }
        $http.post('/api/v1/auth/facebook', { facebookToken: user.authResponse.accessToken, isParent: isParent }).success(function (data) {
          $rootScope.currentUser = UserService.get(data.token, function (user) {
            SessionService.addSession(data)
            success(user)
          })
        }).error(function (data) {
          error(data)
        })
      }
      Facebook.login(loginSuccess, { scope: 'email' })
    },

    /**
     * Create a new user
     *
     * @param  {Object}   user     - user info
     * @param  {Function} callback - optional
     * @return {Promise}
     */
    createUser: function (user, successFn, errorFn) {
      var success = successFn || angular.noop
      var error = errorFn || angular.noop
      // user.isParent = isParent
      UserService.save(user, success, function (httpResponse) {
        error(httpResponse.data)
      })
    },

    addCredentials: function (userId, credentials, successFn, errorFn) {
      var success = successFn || angular.noop
      var error = errorFn || angular.noop
      $http.post('/api/v1/auth/local/signup', {
        userId: userId,
        email: credentials.email,
        password: credentials.password
      }).success(function (data) {
        $rootScope.currentUser = UserService.get(data.token, function (user) {
          SessionService.addSession(data)
          success(user)
        })
      }).error(function (err) {
        error(err)
      })
    },

    /**
     * Change password
     *
     * @param  {String}   oldPassword
     * @param  {String}   newPassword
     * @param  {Function} callback    - optional
     * @return {Promise}
     */
    forgotPassword: function (email, successFn, errorFn) {
      var success = successFn || angular.noop
      var error = errorFn || angular.noop
      $http.post('/api/v1/auth/password/reset-request', {
        email: email
      }, {
          withCredentials: false
        }).success(success).error(error)
    },

    resetPassword: function (token, password, successFn, errorFn) {
      var success = successFn || angular.noop
      var error = errorFn || angular.noop
      $http.post('/api/v1/auth/password/reset', {
        verifyToken: token,
        password: password
      }, {
          withCredentials: false
        }).success(success).error(error)
    },

    updatePassword: function (oldPassword, newPassword, userId) {
      return $http.post('/api/v1/auth/password/update/userId/' + userId, {
        currentPassword: oldPassword,
        newPassword: newPassword
      })
    },

    getSessionSalt: function (token, cb) {
      if (token) {
        $http.post('/api/v1/auth/session/salt', {
          token: token
        }).success(function (data) {
          cb(null, data)
        }).error(function (err) {
          console.log('err', err)
          cb(err)
        })
      } else {
        cb(null, true)
      }
    },

    verifyEmailToken: function (token, successFn, errorFn) {
      var success = successFn || angular.noop
      var error = errorFn || angular.noop
      $http.post('/api/v1/auth/verify', {
        verifyToken: token
      }, {
          withCredentials: false
        }).success(success).error(error)
    },

    resendEmail: function (userId, successFn, errorFn) {
      var success = successFn || angular.noop
      var error = errorFn || angular.noop
      $http.get('/api/v1/auth/verify-request/userId/' + userId)
        .success(function (data) {
          // console.log(data)
          success()
        })
        .error(error)
    },

    updateEmail: function (email, userId) {
      return $http.post('/api/v1/auth/email/update/userId/' + userId, {
        email: email,
        userId: userId
      })
    },

    /**
     * Gets all available info on authenticated user
     *
     * @return {Object} user
     */
    getCurrentUser: function () {
      return $rootScope.currentUser
    },

    getCurrentUserPromise: function () {
      return $q(function (resolve, reject) {
        if (angular.isDefined($rootScope.currentUser)) {
          if ($rootScope.currentUser.hasOwnProperty('$promise')) {
            $rootScope.currentUser.$promise.then(function () {
              resolve($rootScope.currentUser)
            }).catch(function () {
              reject('error retrieving user')
            })
          } else {
            resolve($rootScope.currentUser)
          }
        } else {
          reject('user not logged in')
        }
      })
    },

    /**
     * Check if a user is logged in
     *
     * @return {Boolean}
     */
    isLoggedIn: function () {
      return angular.isDefined($rootScope.currentUser) // && $rootScope.currentUser.hasOwnProperty('role')
    },

    /**
     * Waits for currentUser to resolve before checking if user is logged in
     */
    isLoggedInAsync: function (cb) {
      if (!angular.isDefined($rootScope.currentUser)) {
        cb(false)
        return
      } else if ($rootScope.currentUser.hasOwnProperty('$promise')) {
        $rootScope.currentUser.$promise.then(function () {
          cb(true)
        }).catch(function () {
          cb(false)
        })
      } else {
        cb(true)
      }
    },

    /**
     * Check if a user is an admin
     *
     * @return {Boolean}
     */
    isAdmin: function () {
      if ($rootScope.currentUser && $rootScope.currentUser.roles) {
        return angular.isDefined($rootScope.currentUser) && $rootScope.currentUser.roles.indexOf('admin') !== -1
      }
    },

    isCoach: function () {
      if ($rootScope.currentUser && $rootScope.currentUser.roles) {
        return angular.isDefined($rootScope.currentUser) && $rootScope.currentUser.roles.indexOf('coach') !== -1
      }
    },

    isUser: function () {
      if ($rootScope.currentUser && $rootScope.currentUser.roles) {
        return angular.isDefined($rootScope.currentUser) && $rootScope.currentUser.roles.indexOf('user') !== -1
      }
    },

    validateRole: function (role) {
      if (!role) {
        return false
      }

      if ($rootScope.currentUser && $rootScope.currentUser.roles) {
        return angular.isDefined($rootScope.currentUser) && $rootScope.currentUser.roles.indexOf(role) !== -1
      }
      return false
    },

    /**
     * Get auth token
     */
    getToken: function () {
      return SessionService.getCurrentSession()
    },

    getRoleForTrack: function () {
      return getRoleForTracking()
    },

    trackerLogin: function (event, type, phone) {
      TrackerService.identify($rootScope.currentUser._id)

      TrackerService.peopleSet({
        "$first_name": $rootScope.currentUser.firstName,
        "$last_name": $rootScope.currentUser.lastName,
        "$email": $rootScope.currentUser.email
      });

      if (event === "Sign Up") {
        TrackerService.peopleSet({
          "$created": new Date(),
          "$phone": phone
        });
      }

      TrackerService.register({
        "Email": $rootScope.currentUser.email
      });

      TrackerService.track(event, {
        "Type": type,
        "Roles": getRoleForTracking()
      });
    }
  }
}]
