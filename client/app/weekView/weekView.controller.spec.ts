'use strict';

describe('Component: WeekViewComponent', function () {

  // load the controller's module
  beforeEach(module('takeTurnsApp'));

  var WeekViewComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    WeekViewComponent = $componentController('WeekViewComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
