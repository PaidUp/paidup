'use strict'

module.exports = ['$rootScope', '$cookies', function ($rootScope, $cookies) {
  var SessionService = this
  $rootScope.$on('logout', function () {
    SessionService.removeCurrentSession()
  })

  this.addSession = function (data) {
    $cookies.put('token', data.token)
  }

  this.removeCurrentSession = function () {
    $cookies.remove('token')
  }

  this.getCurrentSession = function () {
    return $cookies.get('token')
  }

  this.setReferringDomain = function (url) {
    $cookies.put('referring_domain', url)
  }

  this.getReferringDomain = function () {
    return $cookies.get('referring_domain')
  }

  this.setReferringLogo = function (url) {
    $cookies.put('referring_logo', url)
  }

  this.getReferringLogo = function () {
    return $cookies.get('referring_logo')
  }

  this.setPathAfterLogin = function (url) {
    $cookies.put('newPath', url)
  }

  this.getPathAfterLogin = function () {
    var res = $cookies.get('newPath')
    $cookies.remove('newPath')
    return res;
  }

  this.setDashboardDate = function (dashboardDate) {
    $rootScope.dashboardDate = dashboardDate
  }

  this.getDashboardDate = function () {
    if (!$rootScope.dashboardDate) {
      var newDate = new Date();
      newDate.setFullYear(newDate.getFullYear() - 1);
      newDate.setHours(0, 0, 0, 0);
      $rootScope.dashboardDate = newDate;
    }
    return $rootScope.dashboardDate;
  }

  this.setDepositDate = function (depositDate) {
    $rootScope.depositDate = depositDate
  }

  this.getDepositDate = function () {
    if (!$rootScope.depositDate) {
      var newDate = new Date();
      newDate.setFullYear(newDate.getFullYear() - 1);
      newDate.setHours(0, 0, 0, 0);
      $rootScope.depositDate = newDate;
    }
    return $rootScope.depositDate;
  }


}]
