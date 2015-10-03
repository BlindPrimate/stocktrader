'use strict';

describe('Service: chartBuilder', function () {

  // load the service's module
  beforeEach(module('stocktraderApp'));

  var $httpBackend;

  // instantiate service
  var chartBuilder;
  beforeEach(inject(function (_chartBuilder_, _$httpBackend_) {
    $httpBackend = _$httpBackend_;
    chartBuilder = _chartBuilder_;
    $httpBackend.expectGET(/^api\/chart.+/)
      //.respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);
      .respond(1);
  }));

  it('should return a results object', function () {

  });

  //it('should throw an error if no results', function () {
    //expect(chartBuilder.singleChartDataHistorical(6, 'knock')).toThrow();
  //});

  it('should return a chart data object', function () {
    expect(chartBuilder.allChartDataHistorical(6, 'MSFT')).toBe(1);
  });

});
