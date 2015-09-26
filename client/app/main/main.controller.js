'use strict';

angular.module('stocktraderApp')
  .controller('MainCtrl', function ($scope, $http, socket, chartBuilder) {

    var init = function () {
        $scope.stocks = {};
        $scope.getChartData(6);
        $scope.chartOptions = chartBuilder.chartOptions;
        $scope.currSpan = 6;
    }

    // get chart data from x months ago
    $scope.getChartData = function (timeInMonths) {
      chartBuilder.chartDataHistorical(timeInMonths).then(function (chartData) {
        $scope.currSpan = timeInMonths;
        $scope.labels = chartData.data.labels;
        $scope.series = chartData.data.series;
        $scope.prices = chartData.data.prices;
      });
    }

    $http.get('/api/stocks').success(function(stocks) {
      $scope.stocks = stocks;
      socket.syncUpdates('stock', $scope.stocks);
    });

    $scope.addStock = function() {
      if($scope.newStock === '') {
        return;
      }
      $scope.newStock = $scope.newStock.toUpperCase();
      $http.post('/api/stocks', { symbol: $scope.newStock });
      $scope.newStock = '';
    };

    $scope.deleteStock = function(stock) {
      $http.delete('/api/stocks/' + stock._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('stock');
    });


  
    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };

    init();
  });
