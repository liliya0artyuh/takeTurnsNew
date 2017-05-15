'use strict';

describe('Service: eventDataContainer', function () {

  // load the service's module
  beforeEach(module('takeTurnsApp.eventDataContainer'));

  // instantiate service
  var eventDataContainer;
  beforeEach(inject(function (_eventDataContainer_) {
    eventDataContainer = _eventDataContainer_;
  }));

  it('should do something', function () {
    expect(!!eventDataContainer).to.be.true;
  });

});
