'use strict';

angular.module('takeTurnsApp')
  .factory('userDataContainer', [ "$cookies", function ($cookies) {
    // Service logic
    // ...

   //every time you call this service to set values first unset them
    //and every time you retrieve values also unset then
      var userRole="";
      var userId = "";

return {
      setUserRole: function(data) {
        userRole = data;
        $cookies.put("userRole", data);
      },
      getUserRole: function() {
        userRole = $cookies.get("userRole");
        return userRole;
      },
      setUserId: function(data) {
        userId = data;
        $cookies.put("userId", data);
      },
      getUserId: function() {
        userId = $cookies.get("userId");
        return userId;
      },
      clearAll: function() {
        userId="";
        userRole = "";
        $cookies.remove("userRole");
        $cookies.remove("userId");
      }
    }

  }]);
