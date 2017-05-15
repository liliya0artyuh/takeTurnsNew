'use strict';

describe('Component: EventCreatorComponent', function () {

  // load the controller's module
  beforeEach(module('takeTurnsApp'));

  var EventCreatorComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    EventCreatorComponent = $componentController('EventCreatorComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
