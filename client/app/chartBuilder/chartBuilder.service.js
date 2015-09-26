'use strict';

angular.module('stocktraderApp')
  .factory('chartBuilder', function ($http) {
    // Service logic
    // ...
    //
    var url = 'api/chart';

    // returns date x months ago from current time
    function xMonthsAgo(months) {
      var date = new Date();
      date.setMonth(date.getMonth() - months);
      return date;
    }



    // Public API here
    
    return {
      chartDataHistorical: function (timePeriod) {
        var fromTime = xMonthsAgo(timePeriod);
        var toTime = new Date();
        return $http.get(url + "?fromDate=" + fromTime + "&toDate=" + toTime);
      },
      chartOptions: {
        animationSteps: 40,
        bezierCurveTension: 0.2,
        pointDotRadius: 3,
        pointHitDetectionRadius: 1,
        datasetFill: false,
      }
    }
  });
