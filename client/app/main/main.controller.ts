'use strict';

(function() {

    var http;
    var userDataContainer;
    var notificationService;
    var Modal;
    var uibModal;
    var rootScope;
    var cookies;
    var window;
    var socket;
    var mainDiv;
    var Email;
    var Name;
    var Description;
    var sendEmail;
    var adminEmail ;
    var calendar;
    var activeUser;
    var adminUser;
    var adminLink;
    var activeLink;
    var adminLinkUrl;
    var activeLinkUrl;
    var agreeWithRules;
    var rulesWindow; 
    var currentGroup;
    var membersTemp;
    var btnCollapseText;
    var btnAddMemberText ;
    var collapseText;
    var memName;
    var memEmail;
    var memCounter;
    var memberBox;
    var messageAdmin;
    var subjectAdmin;
    var resultAdmin;
    var messageMembers;
    var subjectMembers;
    var memEmails;
    var resultMembers;
    var emailConfirmationMembers;
    var emailConfirmationMemNoEmail;
    var emailConfirmationAdmin;
    var emailConfirmationAdminError;
    var emailConfirmationMemError;
    var emailConfirmationA;
    var emailConfirmationM;



class MainController {
 constructor($http, $scope, $window, $rootScope, $cookies, eventDataContainer, userDataContainer, Modal, notificationService, $uibModal, $log, socket) {
    this.http = $http;
    this.userDataContainer = userDataContainer;
    this.notificationService = notificationService;
    this.eventDataContainer = eventDataContainer;
    this.eventDataContainer.clearAll();
    this.Modal = Modal;
    this.uibModal = $uibModal;
    this.rootScope = $rootScope;
    this.cookies = $cookies;
    this.window = $window;
    this.rootScope.isOk="";
    this.socket = socket;
    this.mainDiv=true;//variable to control whether to show create calendar form or not
    //fields for calendar creation ------ START ------------
    this.Email = '';
    this.Name = '';
    this.Description = '';
    this.sendEmail = false;//checkbox field
    console.log("bbbbbbbbbb bbbbbbb bbb"+ String(this.window.location).length );
    this.adminLinkUrl = this.window.location + "admin/";
    this.activeLinkUrl = this.window.location + "calendar/";
    //members subform fields
    this.currentGroup = "None";
    this.membersTemp=[];
    this.btnCollapseText = "Collapse subform!";
    this.btnAddMemberText = "Would you like to add a user?";
    this.collapseText =  this.btnAddMemberText;
    this.memCounter = 0;
    this.memberBox = false;
    //fields for calendar creation ------ END ------------
    //fields for email ------ START -----------
    this.emailConfirmationMembers = "User link has been sent to all members";
    this.emailConfirmationMemNoEmail = "You opted not to send email with a user link to the members.";
    this.emailConfirmationAdmin = "Admin and user links have been sent to your email address. ";
    this.emailConfirmationAdminError = "There appears to be some kind of problem with sending email with the links. Please, manually copy and save the links below for your reference."
    this.emailConfirmationMemError = "An error occured while trying to send email with the link to members. All or some memebrs might not have received the link. ";
    //fields for email ------ END -----------

    this.userDataContainer.setUserRole("passive");

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('calendar');
    });
  }

/*
  $onInit() {
    this.$http.get('/api/things').then(response => {
      this.awesomeThings = response.data;
      this.socket.syncUpdates('thing', this.awesomeThings);
    });
  }
*/


//members subform functions ------------ START ----------
deleteMember(member) {
   for (var i =0; i < this.membersTemp.length; i++) {
      if (this.membersTemp[i].email === member.email) {
        this.membersTemp.splice(i,1);
         this.memCounter --;
         if( this.memCounter === 0) {
           this.currentGroup = "None";
         }else{
         this.currentGroup = this.memCounter;
         }
        break;
      }
    }
}

changeCollapseBtn(){
      if(this.collapseText ==  this.btnAddMemberText){
      this.collapseText = this.btnCollapseText;
      this.memberBox = true;
      }
      else if( this.collapseText == this.btnCollapseText){
      this.collapseText =  this.btnAddMemberText;
        this.memberBox = false;
      }
  }

addMember(){
  if(this.memEmail){
     this.membersTemp.push({name: this.memName, email: this.memEmail});
     if(this.firstEntry==0){
        this.firstEntry = 1;
     }
        this.memCounter ++;
        this.memName='';
        this.memEmail='';
        this.currentGroup = this.memCounter;
    }
  }

//members subform functions ------------ END ----------

    //calendar functions --------- START --------------
    createCalendar() {
  this.adminEmail = this.Email;
 if (this.Email && this.Name) {
      this.http.post('/api/calendars', { dateCreated: new Date(), name: this.Name, description: this.Description, members: this.membersTemp,   paramSerializer: '$httpParamSerializerJQLike'}).then(response => {
      if(response.status == 201) {
          this.calendar = response.data;
          this.createActiveUser();
          this.createAdminUser();
      } else if(response.status == 500) {
          this.window.location.href='/500';
      } else {
          this.window.location.href='/unknown';
      }

    });
  } else {
    console.log("display modal that not all required fields are filled");
  }
}

  createActiveUser(){
this.http.post('/api/users' , {role: "active", calID: this.calendar._id }).then(response => {
      this.activeUser = response.data;
      this.createActiveLink();
    });
}

createAdminUser(){
this.http.post('/api/users' , {role: "admin", email: this.adminEmail, calID: this.calendar._id }).then(response => {
      this.adminUser = response.data;
      this.createAdminLink();
      this.adminEmail ='';
    });
}

resetAddCalFields(){
      this.memCounter=0;
      this.currentGroup = "None";
      this.sendEmail = false;
      this.membersTemp = [];
      this.Description = '';
      this.Name = '';
      this.Email = '';
}

createAdminLink(){
             this.adminLink = this.adminLinkUrl  + this.adminUser._id;
             this.adminUserUpdate();
    }
createActiveLink(){
             this.activeLink = this.activeLinkUrl  + this.activeUser._id;
             this.activeUserUpdate();
        }

        adminUserUpdate(){
  this.http.put('/api/users/'+ this.adminUser._id, { link: this.adminLink, activeUserLink: this.activeLink}).then(response => {
      this.adminUser = response.data;
      });

   this.sendEmailtoAdmin();   
        if (this.sendEmail) {
            this.sendEmailtoMembers();
        } else {
          this.emailConfirmationM =  this.emailConfirmationMemNoEmail;
        }
        this.resetAddCalFields();
        this.mainDiv = false;  
}

activeUserUpdate(){
  this.http.put('/api/users/'+ this.activeUser._id, {link: this.activeLink}).then(response => {
      this.activeUser = response.data;
      });
}
     //calendar functions --------- END -------------- 

//send email functionality --------- SART -----------------------------

    sendEmailtoAdmin(){
            this.messageAdmin= "Your calendar "+ this.calendar.name +" was created. \n\nFollow the link for admin view where you can update or delete your calendar. "+
                                this.adminLink +  "\n\nUse the following link to create and view events. You canshare this link with other users. " + this.activeLink;
            this.subjectAdmin="Admin Calendar Links";
            
              this.http.post('/api/emails', { to: this.Email , emailBody: this.messageAdmin, subject: this.subjectAdmin }).then(response => {
                this.resultAdmin = response.data;
                if(this.resultAdmin == "sent") {
                    this.emailConfirmationA =  this.emailConfirmationAdmin;
                  } else {
                      this.emailConfirmationA = this.emailConfirmationAdminError;
                  }
                console.log("this.resultAdmin "+ this.resultAdmin);
              });
        }

        sendEmailtoMembers(){
            this.messageMembers= "A calendar "+ this.calendar.name +" was created. \n\nAdmin user wants to share the link to the calendar with you.\n\nUse the link below to create and/or view events. " + this.activeLink;
            this.subjectMembers="User Calendar Links";
            this.memEmails="";
            for(var i=0; i < this.membersTemp.length; i++){
                
                console.log(this.membersTemp[i].email);
                this.memEmails+=this.membersTemp[i].email;
                if(i!=(this.membersTemp.length-1)){this.memEmails+=", ";}
            }
            this.http.post('/api/emails', { to: this.memEmails, emailBody: this.messageMembers, subject: this.subjectMembers }).then(response => {
                this.resultMembers = response.data;
                if(this.resultMembers == "sent") {
                    this.emailConfirmationM = this.emailConfirmationMembers; 
                  } else {
                     this.emailConfirmationM = this.emailConfirmationMemError;
                  }
                 console.log("this.resultMembers  " +this.resultMembers );
              });
        }
//send email functionality --------- END -----------------------------

//rules ------------START -----------------

readRules = function () {
   this.notificationService.setBodyArray(["The app can be used only for 18 hours out of 24. For best service, please, make sure to exit the app after using it and in the evenings.", "All event data older than one month will be deleted automatically.", "Empty or unused calendars for over a month will be deleted automatically.", "Users are responsible to keep the links provided to them safe to avoid unwanted interference with their calendars."]);
   this.notificationService.setIsArray(true);
    this.notificationService.setTitle("Rules and Terms");
  this.rulesWindow = this.uibModal.open({
    templateUrl: 'components/notification/notification.html',
    animation: true,
    controller: "NotificationController", 
   
    resolve: {
        textModal: function () {
          return $scope.textModal;
        }
      }
});
this.rulesWindow.result.then(function (isOkClicked) {
      $rootScope.isOk = isOkClicked;
    }, function () {
      $log.info('Modal dismissed at: ' + new Date());
    }); 

      if(this.rootScope.isOk =='ok'){
      //TODO something that would watch the variable value change ------   console.log("ok clicked ggggggg");
      this.acceptRules();
  }
  }

 
acceptRules(){
this.agreeWithRules = true;  
 //             document.getElementById("createCalendar").disabled = false; 
}

    //rules ------------ END -----------------



}


angular.module('takeTurnsApp')
  .component('main', {
    templateUrl: 'app/main/main.html',
    controller: MainController
  });

})();
