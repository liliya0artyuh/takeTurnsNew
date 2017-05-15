'use strict';

class NavbarController {

  isCollapsed = true;
  //end-non-standard

  constructor($location, userDataContainer) {
    this.userDataContainer = userDataContainer;
    this.$location = $location;
    this.userRole = this.userDataContainer.getUserRole();
  }

  isActive(route) {
    return route === this.$location.path();
  }
}

angular.module('takeTurnsApp')
  .controller('NavbarController', NavbarController);
