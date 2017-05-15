'use strict';

angular.module('takeTurnsApp')
  .factory('notificationService', ["$cookies", function ($cookies) {
    //if you make changes to this file then rebuild the project because it will not rebuild automatically


    //every time you call this service to set values first unset them
    //and every time you retrieve values also unset them
      var title = "";
      var bodyText = "";
      var bodyArray = [];
      var isArray;

return {
      setBodyText: function(data) {
        bodyText = data;
        $cookies.put("bodyModal", data);
      },
      getBodyText: function() {
        bodyText = $cookies.get("bodyModal");
        return bodyText;
      },
       setBodyArray: function(data) {
        bodyArray = JSON.stringify(data);
        $cookies.put("bodyModal", JSON.stringify(data));
      },
      getBodyArray: function() {
        bodyArray = $cookies.get("bodyModal");
        return bodyArray;
      },
       setIsArray: function(data) {
        isArray = data;
        $cookies.put("isArrayModal", JSON.stringify(data));
      },
      getIsArray: function() {
        isArray = $cookies.get("isArrayModal");
        return isArray;
      },
      setTitle: function(data) {
        title = data;
        $cookies.put("titleModal", data);
      },
      getTitle: function() {
        title = $cookies.get("titleModal");
        return title;
      },
     
      clearAll: function() {
        title = "";
        bodyText = "";
        isArray = false;
        bodyArray = [];
        $cookies.remove("titleModal");
        $cookies.remove("bodyModal");
        $cookies.remove("isArrayModal");
      }
    }

  }]);
