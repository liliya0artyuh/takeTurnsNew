'use strict';
(function(){

            var http;
            var emailDataContainer;
            var to;
            var subject;
            var emailBody;
            var result;
            var message;
            var userDataContainer;
            var user;
            var calendar;
            var allMemebrs;
            var isAllMembers;
            var sendMembers;
            var isNewMembers;
            var selectEmailsBox;
            var newRecipientEmail;
            var selectedEmails;
            var selectedEmailIds;
            var selectedEmailsForm;
            var notificationService;
            var uibModal;
            var rootScope;
            var numberOfSelected;
            var emailExists;
            var d;
            var h;


class EmailSenderComponent {
  constructor($http, $scope, socket, $cookies, $uibModal, $rootScope, eventDataContainer, userDataContainer, notificationService, emailDataContainer) {
            this.http = $http;
            this.socket = socket;
            this.notificationService = notificationService;
            this.uibModal =  $uibModal;
            this.rootScope= $rootScope;
            this.emailDataContainer = emailDataContainer;
            this.userDataContainer = userDataContainer;
            this.eventDataContainer = eventDataContainer;
            this.eventDataContainer.clearAll();
            this.subject = this.emailDataContainer.getSubject();
            this.emailBody = this.emailDataContainer.getBody();
            this.selectEmailsBox = false;
            this.sendMembers = [];
            this.numberOfSelected = 0;
            this.selectedEmailsForm = document.forms.namedItem("selectMembersE");
            this.emailExists = false;
            //TODO set the who from as the name of the calendar not the name of the app as we have currently

            //after reading from this service clear all values
            this.emailDataContainer.clearAll();

             //send request to BE to get user and then call method to get calendar------------------------------------
          if (this.userDataContainer.getUserId()) {
                $http.get('/api/users/' + this.userDataContainer.getUserId()).then(response => {
                this.user = response.data;
                this.getCalendar();
                this.socket.syncUpdates('calendar', this.calendar);
            });
            } else {
                console.log("ERROR - userID is undefined. please use the link that was provided to you when the calendar was created.");
            }
           
        }

        //send request to BE to send email
        sendEmail() {
            if(this.sendMembers.length > 0){
                for(var p = 0; p < this.sendMembers.length; p++){
                    if(p===0){
                        this.to = this.sendMembers[p];
                    } else {
                        this.to += this.sendMembers[p];
                    }
                    if(p!=(this.sendMembers.length-1)){
                        this.to +=", ";
                    }
                }
            }

           // console.log("this.sendMembers " + this.sendMembers);
            //console.log("this.sendMembers.length " + this.sendMembers.length);
            //console.log("this.to " + this.to);
           // console.log("this.body " + this.emailBody);
           // console.log("this.subject " + this.subject);
            
            if(this.to && this.emailBody && this.subject){
                this.message = "Sending E-mail...Please wait";
                this.http.post('/api/emails', { to: this.to, emailBody: this.emailBody, subject: this.subject }).then(response => {
                    this.result = response.data;
                    if (this.result == "sent") {
                        window.alert("Message Sent");
                        window.close();
                        this.resetSendToAll();
                        window.location.href='/calendar';
                    }
                });
            } else {
                this.notifyMissingFields();
            }
        }


        //send request to BE to get calendar details -------------------------------
        getCalendar() {
            this.http.get('/api/calendars/' + this.user.calID).then(response => {
                this.calendar = response.data;
                this.getAllMembers();
            });
        }

        // this method is triggered by clicking select all users
        selectAllEmails(){
             for (var i = 7; i <  this.selectedEmailsForm.length; i++) {
                    this.selectedEmailsForm[i].checked = true;
            }
            this.numberOfSelected = this.allMembers.length;
        }

        //the method below is used to cancel all emails in the distribution list
        resetSendToAll(){
            this.to = '';
            this.sendMembers = [];
            this.resetSelected();
        }

        //the following method used to reset emails in the selected users
        resetSelected(){
            this.numberOfSelected = 0;
                this.selectedEmailsForm = document.forms.namedItem("selectMembersE");
             for (var i = 7; i <  this.selectedEmailsForm.length; i++) {
                if ( this.selectedEmailsForm[i].checked) {
                    this.selectedEmailsForm[i].checked = false;
                }
            }
        }

        //when user clicks on a checkbox to add or remove email address from the list
        addEmail(selectedEmail) {
            if(document.getElementById(selectedEmail).checked == true) {
                this.numberOfSelected += 1;
            } else {
                this.numberOfSelected -= 1;
            }
        }

        //get all members from the calendar
        getAllMembers(){
             this.allMembers = this.calendar.members;
        }


        //deletes emails one by one from the distribution list
        deleteMember(member){
            for (var i =0; i < this.sendMembers.length; i++) {
              if (this.sendMembers[i] === member) {
                this.sendMembers.splice(i, 1);
                this.memCounter --;
                break;
              }
            }

              this.selectedEmailsForm = document.forms.namedItem("selectMembersE");
            for (var k = 0; k < this.selectedEmailsForm.length; k++) {
              if(this.selectedEmailsForm[k].value === member){
                this.selectedEmailsForm[k].checked = false;
                this.numberOfSelected --;
                break;
              }
            }
         }

         //this method is called when user adds new emails
        addRecipient() {
            if(this.newRecipientEmail){


                if (!(this.allMembers.length > 0)) {
                    this.allMembers = [];
                }
                this.emailExists = false;
                for (var t = 0; t < this.allMembers.length; t++) {
                    if(this.allMembers[t].email === this.newRecipientEmail)
                    {
                        this.emailExists = true;
                        this.notifySomethingWrong("The email your are trying to enter already exists. Please enter a different email address.","Email Already Exists");
                    }
                }

                if(this.emailExists === false){
                    this.allMembers.unshift({name: "", email: this.newRecipientEmail});
                    //this.selectedEmailsForm = document.forms.namedItem("selectMembersE");
                    //this.selectedEmailsForm[6].checked = true;
                }
                    this.newRecipientEmail = '';

            } else {
                this.notifyMissingFields();
            }
        }


        //this method open up box where user can select specific emails
        openSelectEmails (){
            if(this.selectEmailsBox === false){
                this.selectEmailsBox = true;
            }else {
                this.selectEmailsBox = false;
            }
        }

        buildSelectedEmails(member) {

        }

        //after user selects emails and clicks submit button
        submitSelected() {
            this.sendMembers=[];
            for (var i = 7; i <  this.selectedEmailsForm.length; i++) {
                if ( this.selectedEmailsForm[i].checked ) {
                        this.sendMembers.push(this.selectedEmailsForm[i].value);
                    }
              this.selectEmailsBox = false;
            }
        }


//notifications

        notifyMissingFields(){
            this.notifySomethingWrong("Some values are missing. Please, fill all required fields and try again.", "Missing Values");
        }

notifySomethingWrong = function (b, t) {
        this.notificationService.clearAll();
        this.notificationService.setBodyText(b);
        this.notificationService.setIsArray(false);
        this.notificationService.setTitle(t);
  
        this.notificationWindow = this.uibModal.open({
            templateUrl: 'components/notification/notification.html',
            animation: true,
            controller: "NotificationController", 
    
            resolve: {
                textModal: function () {
                return $scope.textModal;
            }
          }
    
    });

    this.notificationWindow.result.then(function (isOkClicked) {
          $rootScope.isOk = isOkClicked;
        }, function () {
          $log.info('Modal dismissed at: ' + new Date());
        }); 

          if(this.rootScope.isOk =='ok'){
          //TODO something that would watch the variable value change ------   console.log("ok clicked ggggggg");
      }
  }



        }

angular.module('takeTurnsApp')
  .component('emailSender', {
    templateUrl: 'app/emailSender/emailSender.html',
    controller: EmailSenderComponent
  });

})();
