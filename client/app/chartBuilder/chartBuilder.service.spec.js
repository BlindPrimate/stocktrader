'use strict';

describe('Service: chartBuilder', function () {

  // load the service's module
  beforeEach(module('stocktraderApp'));

  // instantiate service
  var chartBuilder;
  beforeEach(inject(function (_chartBuilder_) {
    chartBuilder = _chartBuilder_;
  }));

  //it('should throw an error if no results', function () {
    //expect(chartBuilder.singleChartDataHistorical(6, 'knock')).toThrow();
  //});

});
