'use strict';
(function(){

	var message;
	
class AboutComponent {


  constructor() {
    this.message = 'Hello';
  }
}

angular.module('takeTurnsApp')
  .component('about', {
    templateUrl: 'app/about/about.html',
    controller: AboutComponent
  });

})();
