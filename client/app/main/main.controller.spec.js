'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('stocktraderApp'));
  beforeEach(module('socketMock'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope, chartBuilder, symbolSearch) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/stocks/all/current')
      .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of stocks to the scope', function () {
    $httpBackend.flush();
    expect(scope.stocks.length).toBe(4);
  });
});
