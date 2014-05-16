'use strict';

$(function() {
  var $elem = $('#content');

  $(window).bind('scrollstart', function(){
    $('#footer').stop().animate({'opacity':'0.2'});
  });
  $(window).bind('scrollstop', function(){
    $('#footer').stop().animate({'opacity':'1'});
  });
});

angular.module('crmPostgresWebApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ui.bootstrap',
    'ui.calendar',
    'chieffancypants.loadingBar',
    'ngAnimate',
    'angucomplete',
    'mgcrea.ngStrap'
  ])
  .config(function ($routeProvider, cfpLoadingBarProvider, $datepickerProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .when('/uvod', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/profil', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileController'
      })
      .when('/kontakty', {
        templateUrl: 'views/contacts.html',
        controller: 'ContactsController'
      })
      .when('/rezervace-mistnosti', {
        templateUrl: 'views/reservation_office.html',
        controller: 'ReservationOfficeCtrl'
      })
      .when('/crm', {
        templateUrl: 'views/crm.html',
        controller: 'CrmCtrl'
      })
      .otherwise({
        redirectTo : '/login'
      });
    cfpLoadingBarProvider.includeSpinner = false;
    angular.extend($datepickerProvider.defaults, {
      dateFormat: 'dd.MM.yyyy',
      startWeek: 1
    });
  });
