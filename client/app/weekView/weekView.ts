'use strict';

angular.module('takeTurnsApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/week', {
        template: '<week-view></week-view>'
      });
  });
