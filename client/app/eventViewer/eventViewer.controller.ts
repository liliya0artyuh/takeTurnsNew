'use strict';
(function(){
            var http;
            var scope;
            var user;
            var selectedEvent;
            var message;
            var nxtDay = 0;
            var backUpEventSelected;
            var backUpEventStartTime;
            var backUpEventEndTime;
            var backUpEventDate;
            var showEventDetailView = false;
            var showEventDetailForm = true;
            var awesomeEvents = [];
            var wantDelete;
            var calendar;
            var window;
            var url;
            var eventStartTime;
            var eventEndTime;
            var eventDate;
            var userDataContainer;
            var searchText;

class EventViewerComponent {
 constructor($http, $scope, socket, $window, $cookies, eventDataContainer, userDataContainer, emailDataContainer) {
            this.userDataContainer = userDataContainer;
            console.log("aaaaaaaaaa aa " + this.userDataContainer.getUserRole());
            if(this.userDataContainer.getUserRole() != "admin") {
            	 this.userDataContainer.setUserRole("active");
			}
            this.emailDataContainer = emailDataContainer;
            this.eventDataContainer = eventDataContainer;
            this.eventDataContainer.clearAll();
            this.http = $http;
            this.window = $window;
            this.url = this.window.location;
            this.eventStartTime = new Date();
            this.eventEndTime = new Date();
            this.eventDate = new Date();
            this.scope = $scope;
            this.scope.slot = this.calendar;
            $scope.events = [];
            this.scope.calendarView = 'day';
            this.scope.calendarDateDay = new Date();
            this.scope.calendarViewMonth = 'month';
            this.scope.calendarDateMonth = new Date();

            //calnedar vars ---------------------------------
            // these are labels for the days of the week
            this.cal_days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            // these are human-readable month name labels, in order
            this.cal_months_labels = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];

            // these are the days of the week for each month, in order
            this.cal_days_in_month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

            // this is the current date
            this.cal_current_date = new Date(); 

            this.firstDay = new Date(this.year, this.month, 1);

            this.startingDay = this.firstDay.getDay();

            this.monthLength = this.cal_days_in_month[this.month];

            if (this.month == 1) { // February only!
                if ((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0){
                     this.monthLength = 29;
                }
            }

            this.monthName = this.cal_months_labels[this.month];


            //calednar vars ------------------------------


            this.urlLength;
            this.lengthsOfUrlWithID;
            console.log();
            if(String(this.url).search("localhost") === -1){
                this.urlLength = 41;
                this.lengthsOfUrlWithID = 65;
            } else {
                console.log("in localhost");
                this.urlLength = 31;
                this.lengthsOfUrlWithID = 55;
            }

            //check if userId is already set in cookies. if not and url has userId then set userId in cookies 
            if (this.url.toString().length == this.lengthsOfUrlWithID) {
                this.userDataContainer.setUserId(this.url.toString().substr(this.urlLength, 24));
                this.userDataContainer.setUserRole("active");
            }
            //----------------- Global vars END---------------------

            //get calendar id from user
            paramSerializer: '$httpParamSerializerJQLike';

            if (this.userDataContainer.getUserId()) {
                $http.get('/api/users/' + this.userDataContainer.getUserId()).then(response => {
                    if(response.status == 200){
                        this.user = response.data;
                        this.getCalendar();
                        socket.syncUpdates('calendar', this.calendar);
                    } else {
                        //display error
                       this.displayUserError();
                    }
                }).catch(response => {
                    this.displayUserError();
                });
            } else {
                console.log("ERROR - userID is undefined. please use the link that was provided to you when the calendar was created.");
            }


            //auto generated start
            $scope.$on('$destroy', function() {
                socket.unsyncUpdates('event');
            });
            //auto generated end
        }

        displayUserError() {
             this.window.location.href='errors/userError.html';   
        }


        // get calendar details
        getCalendar() {
            this.http.get('/api/calendars/' + this.user.calID).then(response => {
                this.calendar = response.data;
               /*
                this.dayEvents();
                this.monthEvents();
                if (this.getIndexOfFirstEventByDay() != -1) {
                    this.detailsEvent(this.calendar.events[this.getIndexOfFirstEventByDay()]._id);
                } else {
                    this.detailsEvent(null);
                }
                */
            });
        }


    convertDate(isoDate) {
            this.goodDate = new Date(isoDate);
            return this.cal_days_labels[this.goodDate.getDay()] + ', ' + this.goodDate.getDate() + ' ' + this.cal_months_labels[this.goodDate.getMonth()];
        }


//code to delete an event
        deleteEvent(event) {
                if(confirm('Are you sure you want to delete this event: \n' + event.title + ' Event, \nHosted by ' + event.host + ' on ' + event.date) === true){
                    console.log("wantDelete " + this.wantDelete);
                    //send request to delete event
                    this.http.patch('/api/calendars/' + this.calendar._id + "/DeleteEvent/" + event._id).then(response => {
                        this.calendar = response.data;
                        //alert('The ' + event.title + ' Event, Hosted by ' + event.host + ' has been deleted successfully from this calendar.');
                        //window.location.reload();
                    });
                }
        }


        sendInvitation(eventDetails){
                    console.log(" you can send email from here ---------- ");
            //before writing values to this service clear all values
            this.emailDataContainer.clearAll();
            this.emailDataContainer.setBody("You are invited to the following event as described in the calendar " + this.calendar.name +
                "\nEvent Info: " + "\nName: " + eventDetails.title + "\nDate: " + this.convertDate(eventDetails.date) + "\nStart Time: " + this.getTime(eventDetails.startTime)  + "\nEnd Time: " + eventDetails.endTime + "" + "\nDescription: " + eventDetails.info);
            this.emailDataContainer.setSubject("Invitation to " + eventDetails.title + ". Event is on " + this.convertDate(eventDetails.date) + ", hosted by " + eventDetails.host);
            console.log(" doe sit reach to here? ");
        }

        //copy event and ass to factory/service 
        copyEvent(calEvent){
            this.setEventFields(calEvent);
            this.eventDataContainer.setButtonName("CREATE COPY");
        }

        //copy event and ass to factory/service 
        editEvent(calEvent){
            this.setEventFields(calEvent);
            this.eventDataContainer.setButtonName("UPDATE EVENT");
        }

        setEventFields(calEvent){
            this.eventDataContainer.setEndTime(calEvent.endTime);
            this.eventDataContainer.setStartTime(calEvent.startTime);
            this.eventDataContainer.setDescription(calEvent.info);
            this.eventDataContainer.setEventDate(calEvent.date);
            this.eventDataContainer.setHostName(calEvent.host);
            this.eventDataContainer.setTitle(calEvent.title);
            this.eventDataContainer.setEventId(calEvent._id);
        }

        showAllEvents(){
            this.searchText ="";
        }
               
/*
        showDetails(event){
            this.showEventDetailView  = true;
            this.selectedEvent = event;

        }
*/

/*
        // detailsEvents methods
        private detailsEvent(eventId) {
            if (eventId != null) {
                for (var dayEvent in this.calendar.events) {
                    if (this.calendar.events[dayEvent]._id == eventId) {
                        this.selectedEvent = this.calendar.events[dayEvent];

                        this.eventStartTime = this.timeFormater(this.selectedEvent.date, this.selectedEvent.startTime);
                        this.eventEndTime = this.timeFormater(this.selectedEvent.date, this.selectedEvent.endTime);
                        this.eventDate = new Date(moment(this.selectedEvent.date).format());
                    }
                }
            } else {
                this.selectedEvent = null;

                this.eventStartTime = new Date();
                this.eventEndTime = new Date();
                this.eventDate = new Date();
            }
        }
        */
/*
        /** Format the Time accepting two parameter
         * 1. Date of the time
         * 2. Time to be formated
         *  
        private timeFormater(uDate, uTime) {
            var fDate = new Date(uDate.substring(0, 10) + "T" + uTime);

            return new Date(moment(fDate).format());
        }

*/

/*
        // Return the index of the first event
        private getIndexOfFirstEventByDay() {
            var myIndex = -1;
            var firstTime = 24;
            var count = 0;
            var currentDate = new Date();
            var month = "" + (currentDate.getMonth() + 1);
            var day = "" + (currentDate.getDate() + this.nxtDay);
            var uEvents = this.calendar.events;

            if (month.length < 2) {
                month = "0" + month;
            }
            if (day.length < 2) {
                day = "0" + day;
            }

            uEvents.forEach(element => {
                // Check if the element is of current month and date
                if (element.date.substring(5, 7) == month && element.date.substring(8, 10) == day) {
                    if (element.startTime.substring(0, 2) < firstTime) {
                        firstTime = element.startTime.substring(0, 2);
                        myIndex = count;
                    }
                }
                count++;
            });
            return myIndex;
        }

        // Listen for the Event Clicked
        eventClicked(events) {
            this.detailsEvent(events.eventId);
        }

        // On the view button < or > clicked
        dayNavButtonClicked(clickedArrow: number) {
            if (clickedArrow != 0) {
                this.nxtDay += clickedArrow;
            } else {
                this.nxtDay *= clickedArrow;
            }
            if (this.getIndexOfFirstEventByDay() != -1) {
                this.detailsEvent(this.calendar.events[this.getIndexOfFirstEventByDay()]._id);
            } else {
                this.detailsEvent(null);
            }
        }

        //Hide Event Detail View
        public hideEventView(buttonClicked: number) {
            this.backUpEventSelected = angular.copy(this.selectedEvent);
            this.backUpEventStartTime = angular.copy(this.eventStartTime);
            this.backUpEventEndTime = angular.copy(this.eventEndTime);
            this.backUpEventDate = angular.copy(this.eventDate);

            this.switchEventDetailView(buttonClicked);
        }

        // Change the view of the event details
        private switchEventDetailView(buttonClicked: number) {
            switch (buttonClicked) {
                case 0:
                    this.showEventDetailView = false;
                    this.showEventDetailForm = false;
                    break;
                case 1:
                    this.showEventDetailView = true;
                    this.showEventDetailForm = true;
                    break;
            }
        }

        //code to delete an event
        deleteEvent(buttonClicked: number) {
            //send request to delete event
            this.$http.patch('/api/calendars/' + this.calendar._id + "/DeleteEvent/" + this.selectedEvent._id).then(response => {
                this.calendar = response.data;
                if (this.getIndexOfFirstEventByDay() != -1) {
                    this.detailsEvent(this.calendar.events[this.getIndexOfFirstEventByDay()]._id);
                } else {
                    this.detailsEvent(null);
                }
                alert('The ' + this.selectedEvent.title + ' Event, Hosted by ' + this.selectedEvent.host + ' has been deleted successfully from this calendar.');
                window.location.reload();
            });
            this.switchEventDetailView(buttonClicked);
        }
        */

/*
        // Day Event
        dayEvents() {
            if (this.calendar.events.length == 0) {
                this.$scope.calendarView = 'day';
                this.$scope.calendarDateDay = new Date();
            }
            else {
                for (var i in this.calendar.events) {
                    var calEvent = this.calendar.events[i].date;
                    var startTime = new Date(calEvent.substring(0, 10) + "T" + this.calendar.events[i].startTime);
                    var endTime = new Date(calEvent.substring(0, 10) + "T" + this.calendar.events[i].endTime);

                    // Required to set the calendar months or day
                    this.$scope.calendarView = 'day';
                    this.$scope.calendarDateDay = new Date();

                    this.$scope.events[i] =
                        {
                            title: this.calendar.events[i].title,
                            startsAt: new Date(moment(startTime).format()),
                            endsAt: new Date(moment(endTime).format()),
                            eventId: this.calendar.events[i]._id
                        };
                }
            } // End The for loop
        } // End dayEvents method

*/

/*

        // Update Events
        updateEvent(buttonClicked: number) {
            this.$http.put('/api/calendars/updateEvent/' + this.calendar._id, { eventId: this.selectedEvent._id, title: this.selectedEvent.title, host: this.selectedEvent.host, date: this.selectedEvent.date, startTime: this.selectedEvent.startTime, endTime: this.selectedEvent.endTime, info: this.selectedEvent.info, paramSerializer: '$httpParamSerializerJQLike' }).then(response => {

                this.calendar = response.data;
                this.detailsEvent(this.calendar.events[this.getIndexOfFirstEventByDay()]._id);

                alert("You have successfully edited the event.");
                window.location.reload();
            });
            this.switchEventDetailView(buttonClicked);
        }

        // Cancel Update
        cancelEdit(buttonClicked: number) {
            this.selectedEvent = this.backUpEventSelected;
            this.selectedEvent = this.backUpEventSelected;
            this.eventStartTime = this.backUpEventStartTime;
            this.eventEndTime = this.backUpEventEndTime;
            this.eventDate = this.backUpEventDate;

            this.switchEventDetailView(buttonClicked);
        }

        */

/*
        // Month Event
        monthEvents() {
            if (this.calendar.events.length == 0) {
                this.$scope.calendarViewMonth = 'month';
                this.$scope.calendarDateMonth = new Date();
            }
            else {
                for (var i in this.calendar.events) {
                    var calEvent = this.calendar.events[i].date;
                    var startTime = new Date(calEvent.substring(0, 10) + "T" + this.calendar.events[i].startTime);
                    var endTime = new Date(calEvent.substring(0, 10) + "T" + this.calendar.events[i].endTime);

                    // Required to set the calendar months or day
                    this.$scope.calendarViewMonth = 'month';
                    this.$scope.calendarDateMonth = new Date();
                    this.$scope.events[i] =
                        {
                            title: this.calendar.events[i].title,
                            startsAt: new Date(moment(startTime).format()),
                            endsAt: new Date(moment(endTime).format()),
                            eventId: this.calendar.events[i]._id
                        };
                }
            } // End The for loop
        } // End monthEvents method
*/
    }

angular.module('takeTurnsApp')
  .component('eventViewer', {
    templateUrl: 'app/eventViewer/eventViewer.html',
    controller: EventViewerComponent
  });

})();
