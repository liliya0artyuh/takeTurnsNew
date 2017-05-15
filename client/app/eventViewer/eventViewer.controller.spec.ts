'use strict';

describe('Component: EventViewerComponent', function () {

  // load the controller's module
  beforeEach(module('takeTurnsApp'));

  var EventViewerComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    EventViewerComponent = $componentController('EventViewerComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
