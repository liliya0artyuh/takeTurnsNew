'use strict';

angular.module('takeTurnsApp')
  .factory('eventDataContainer', ["$cookies", function ($cookies)  {
      var startTime = "";
      var endTime="";
      var hostName = "";
      var eventDate="";
      var eventName = "";
      var eventDescription = "";
      var eventId = "";
      var buttonName = "CREATE EVENT";
      $cookies.put("buttonName", "CREATE EVENT");

return {
      setStartTime: function(data) {
        startTime = data;
        $cookies.put("startTime", data);
      },
      getStartTime: function() {
        startTime = $cookies.get("startTime");
        return startTime;
      },
      setEndTime: function(data) {
        endTime = data;
        $cookies.put("endTime", data);
      },
      getEndTime: function() {
        endTime = $cookies.get("endTime");
        return endTime;
      },
      setHostName: function(data) {
        hostName = data;
        $cookies.put("hostName", data);
      },
      getHostName: function() {
        hostName = $cookies.get("hostName");
        return hostName;
      },
      setEventDate: function(data) {
        eventDate = data;
        $cookies.put("eventDate", data);
      },
      getEventDate: function() {
        eventDate = $cookies.get("eventDate");
        return eventDate;
      },
      setTitle: function(data) {
        eventName = data;
        $cookies.put("eventName", data);
      },
      getTitle: function() {
        eventName = $cookies.get("eventName");
        return eventName;
      },
      setDescription: function(data) {
        eventDescription = data;
        $cookies.put("eventDescription", data);
      },
      getDescription: function() {
        eventDescription = $cookies.get("eventDescription");
        return eventDescription;
      },
      setEventId: function(data) {
        eventId = data;
        $cookies.put("eventId", data);
      },
      getEventId: function() {
        eventId = $cookies.get("eventId");
        return eventId;
      },
      setButtonName: function(data) {
        buttonName = data;
        $cookies.put("buttonName", data);
      },
      getButtonName: function() {
        buttonName = $cookies.get("buttonName");
        return buttonName;
      },
      clearAll: function() {
        startTime = "";
        endTime="";
        hostName = "";
        eventDate="";
        eventName = "";
        eventDescription = "";
        eventId = "";
        buttonName = "CREATE EVENT";
        $cookies.remove("startTime");
        $cookies.remove("endTime");
        $cookies.remove("hostName");
        $cookies.remove("eventDate");
        $cookies.remove("eventName");
        $cookies.remove("eventDescription");
        $cookies.remove("eventId");
        $cookies.remove("buttonName");
        $cookies.put("buttonName", "CREATE EVENT");
      }
    }

  }]);
