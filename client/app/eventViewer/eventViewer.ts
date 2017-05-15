'use strict';

angular.module('takeTurnsApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/calendar/:id', {
        template: '<event-viewer></event-viewer>'
      })
       .when('/calendar', {
        template: '<event-viewer></event-viewer>'
      });
  });
