'use strict';

angular.module('takeTurnsApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/event', {
        template: '<event-creator></event-creator>'
      });
  });
