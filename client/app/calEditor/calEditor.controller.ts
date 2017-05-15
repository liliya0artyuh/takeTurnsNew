'use strict';
(function(){

    var btnCollapseText;
    var btnAddMemberText;
    var collapseText;
    var calendar;
    var message;
    var adminEmail;
    var calName;
    var calDescription;
    var membersTemp;
    var memberName;
    var memberEmail;
    var collapseText;
    var user;
    var editCal;
    var deleteFalse;
    var memCounter;
    var addMembers;
    var delMembers;
    var goodDate;
    var urlLength;
    var lengthsOfUrlWithID;
    var http;
    var location;
    var window;
    var userDataContainer;
    var emailDataContainer;
    var url;
    var cal_days_labels;
    var cal_months_labels;

class CalEditorComponent {
    constructor($http, $scope, socket, $window, $location, eventDataContainer, userDataContainer, emailDataContainer) {
            this.userDataContainer = userDataContainer;
            this.userDataContainer.setUserRole("admin");
            this.http = $http;
            this.location = $location;
            this.window = $window;
            this.emailDataContainer = emailDataContainer;
            this.eventDataContainer = eventDataContainer;
            this.eventDataContainer.clearAll();
            this.btnCollapseText = "Collapse subform!";
            this.btnAddMemberText = "Would you like to add a user?";
            this.collapseText = "Would you like to add a user?";
            this.collapseText =  this.btnAddMemberText;
            this.editCal = true;
            this.deleteFalse = true;
            this.goodDate = new Date();
            this.url = this.window.location;
            this.addMembers = [];
            this.delMembers = [];
            this.membersTemp = [];
            
            if(String(this.url).search("localhost") === -1){
                this.urlLength = 38;
                this.lengthsOfUrlWithID = 62;
            } else {
                this.urlLength = 28;
                this.lengthsOfUrlWithID = 52;
            }
                // these are labels for the days of the week
            this.cal_days_labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            // these are human-readable month name labels, in order
            this.cal_months_labels = ['January', 'February', 'March', 'April',
                     'May', 'June', 'July', 'August', 'September',
                     'October', 'November', 'December'];


            //get user id from url  ----------------------------
            paramSerializer: '$httpParamSerializerJQLike';

            if (this.url.toString().length == this.lengthsOfUrlWithID) {
                this.userDataContainer.setUserId(this.url.toString().substr(this.urlLength, 24));
                console.log("lllllll " + this.userDataContainer.getUserId());
            } 

            //send request to BE to get user and then call function to get calendar 
            if (this.userDataContainer.getUserId()) {
                $http.get('/api/users/' + this.userDataContainer.getUserId()
                    ).then(response => {
                    if(response.status == 200){
                        this.user = response.data;
                        if (this.user.role === "admin") {
                            //get calendar from BE
                             this.userDataContainer.setUserRole(this.user.role);
                            console.log("bbbbbbbbbbb  " + this.userDataContainer.getUserRole());
                            this.getCalendar();
                        } else {
                        //display error
                    this.displayUserError();
                    }
                        socket.syncUpdates('calendar', this.calendar);
                } else {
                        //display error
                    this.displayUserError();
                }
                }).catch(response => {
                    if(response.status == 404){
                    this.displayUserError();
                    } else if (response.status == 500){
                        this.window.location.href='app/error/500.html';
                    } else {
                       this.window.location.href='/unknown';
                    }
                    });
            } else {
                        //display error
                    this.displayUserError();
             }

            //---------------------- auto generated start ----------------------------------
            $scope.$on('$destroy', function() {
                socket.unsyncUpdates('calendar');
            });
            //---------------------- auto generated end ----------------------------------
        }


        displayUserError() {
             this.window.location.href='app/error/userError.html';   
        }



        // send request to get calendar from BE -------------------------------
        getCalendar() {
            this.http.get('/api/calendars/' + this.user.calID
                ).then(response => {
                    if(response.status == 200) {
                        this.calendar = response.data;
                        this.memCounter = this.calendar.members.length;
                    } else {
                       this.window.location.path('/unknown');
                    }
                }).catch( response => {
                    if(response.status == 404){
                        this.window.location.href='/404';
                    } else if (response.status == 500){
                        this.window.location.href='app/error/500.html';
                    } else {
                        this.window.location.href='/unknown';
                    }
            });
        }

        // assigning and defining some variables 
        editCalendar() {
            this.collapseMemberForm();
            this.adminEmail = this.user.email;
            this.calName = this.calendar.name;
            this.calDescription = this.calendar.description;
            this.membersTemp = this.calendar.members;
            this.memberName;
            this.memberEmail;
            this.editCal = false;
        }


        //send request to BE to delete calendar
        deleteCalendar() {
            this.http.delete('/api/calendars/' + this.user.calID).then(response => {
                if(response.status == 204) {
                    this.message = "You have successfully deleted the calendar. \n\nPlease disregard the links that were given to you. \n\nTo create a new calendar click on the logo above to go to home page.";
                    this.deleteFalse = false;
                } else if(response.result == 404){
                        this.window.location.href='/404';
                    } else {
                    this.window.location.href = '/unknown';
                }
            }).catch( response => {
                    if(response.status == 404){
                        this.window.location.href='/404';
                    } else if (response.status == 500){
                        this.window.location.href='/error/500.html';
                    } else {
                        this.window.location.href='/unknown';
                    }
                });
        }

        //cancel update - go back to view calendar
        cancelUpdate() {
            this.editCal = true;
        }


        //send request to BE to update calendar details
        updateCalendar() {
             //update admin email
            if (this.adminEmail) {
                this.http.put('/api/users/' + this.user._id, { email: this.adminEmail }).then(response => {
                    this.user = response.data;
                });
            }
            
            this.http.put('/api/calendars/' + this.user.calID, { name: this.calName, description: this.calDescription, members: this.membersTemp, paramSerializer: '$httpParamSerializerJQLike' }).then(response => {
                this.calendar = response.data;
                this.message = "You have successfully edited the calendar.";
                alert(this.message);
                this.editCal = true; // goes back to the calendar details view
            });
        }

        //delete members from temporary array
        deleteMember(member) {
            for (var i = 0; i < this.membersTemp.length; i++) {
                if (this.membersTemp[i].email === member.email) {
                    this.membersTemp.splice(i, 1);
                    break;
                }
            }
        }

        //adding new members to temp array
        addMember() {
            if (this.memberEmail) {
                this.membersTemp.push({ name: this.memberName, email: this.memberEmail });
                this.resetMemberSubForm();
            }
        }


    convertDate(isoDate) {
            this.goodDate = new Date(isoDate);
            console.log("this.goodDate " + this.goodDate);
            return this.cal_days_labels[this.goodDate.getDay()] + ', ' + this.goodDate.getDate() + ' ' + this.cal_months_labels[this.goodDate.getMonth()] + ' ' + this.goodDate.getFullYear();
        }
        
        //Open Email page with Admin link in the Body
        shareAdminLink(link) {
            //before writing values to this service clear all values
            this.emailDataContainer.clearAll();
            this.emailDataContainer.setBody("The admin user for the " + this.calendar.name + " calendar Would like to share the following admin link with you: \n" + link +
                "\nCalendar Info: " + "\nName: " + this.calendar.name + "\nDescription: " + this.calendar.description);
            this.emailDataContainer.setSubject("Admin link to the calendar '" + this.calendar.name + "'");
        }
        
        //Open Email Page with Users Link
        shareUserLink(link) {
            //before writing values to this service clear all values
            this.emailDataContainer.clearAll();
            this.emailDataContainer.setBody("The admin user for the " + this.calendar.name + " calendar Would like to share the following link with you: \n" + link +
                "\nCalendar Info: " + "\nName: " + this.calendar.name + "\nDescription: " + this.calendar.description);
            this.emailDataContainer.setSubject("Link to the calendar '" + this.calendar.name + "'");
        }

            resetMemberSubForm() {
                this.memberEmail ="";
                this.memberName = "";
            }

    changeCollapseBtn(){
          if(this.collapseText ==  this.btnAddMemberText){
            this.collapseText = this.btnCollapseText;
            this.memberBox = true;
          }
          else if( this.collapseText == this.btnCollapseText){
            this.collapseMemberForm();
          }
            this.resetMemberSubForm();
          }

    collapseMemberForm() {
            this.collapseText =  this.btnAddMemberText;
            this.memberBox = false;
        }
}

angular.module('takeTurnsApp')
  .component('calEditor', {
    templateUrl: 'app/calEditor/calEditor.html',
    controller: CalEditorComponent
  });

})();
