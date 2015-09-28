'use strict';

describe('Service: symbolSearch', function () {

  // load the service's module
  beforeEach(module('stocktraderApp'));

  // instantiate service
  var symbolSearch;
  beforeEach(inject(function (_symbolSearch_) {
    symbolSearch = _symbolSearch_;
  }));

  it('should do something', function () {
    expect(!!symbolSearch).toBe(true);
  });

});
