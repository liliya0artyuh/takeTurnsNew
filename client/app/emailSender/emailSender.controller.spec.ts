'use strict';

describe('Component: EmailSenderComponent', function () {

  // load the controller's module
  beforeEach(module('takeTurnsApp'));

  var EmailSenderComponent, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController, $rootScope) {
    scope = $rootScope.$new();
    EmailSenderComponent = $componentController('EmailSenderComponent', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).to.equal(1);
  });
});
