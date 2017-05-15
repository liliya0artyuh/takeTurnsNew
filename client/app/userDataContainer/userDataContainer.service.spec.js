'use strict';

describe('Service: userDataContainer', function () {

  // load the service's module
  beforeEach(module('takeTurnsApp.userDataContainer'));

  // instantiate service
  var userDataContainer;
  beforeEach(inject(function (_userDataContainer_) {
    userDataContainer = _userDataContainer_;
  }));

  it('should do something', function () {
    expect(!!userDataContainer).to.be.true;
  });

});
