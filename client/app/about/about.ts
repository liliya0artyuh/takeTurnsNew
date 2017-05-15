'use strict';

angular.module('takeTurnsApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/about', {
        template: '<about></about>'
      });
  });
