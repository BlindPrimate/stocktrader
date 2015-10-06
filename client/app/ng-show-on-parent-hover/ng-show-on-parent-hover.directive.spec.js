'use strict';

describe('Directive: ngShowOnParentHover', function () {

  // load the directive's module
  beforeEach(module('stocktraderApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ng-show-on-parent-hover></ng-show-on-parent-hover>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ngShowOnParentHover directive');
  }));
});