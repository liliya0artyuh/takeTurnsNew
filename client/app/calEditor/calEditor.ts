'use strict';

angular.module('takeTurnsApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/admin/:id', {
        template: '<cal-editor></cal-editor>'
      })
      .when('/admin', {
        template: '<cal-editor></cal-editor>'
      });
  });
