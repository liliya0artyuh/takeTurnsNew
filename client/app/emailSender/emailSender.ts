'use strict';

angular.module('takeTurnsApp')
  .config(function ($routeProvider) {
    $routeProvider
       .when('/emailSender', {
        template: '<email-sender></email-sender>'
      });
  });
