'use strict';

describe('Component: CalEditorComponent', function () {

  // load the controller's module
  beforeEach(module('takeTurnsApp'));

  var CalEditorComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    CalEditorComponent = $componentController('CalEditorComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
