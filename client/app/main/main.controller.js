'use strict';

angular.module('stocktraderApp')
  .controller('MainCtrl', function ($scope, $http, socket, chartBuilder) {

    var init = function () {
        $scope.currSpan = 6;
        $scope.currDisplaySymbol = '';
        $scope.stocks = {};
        $scope.getChartData();
        $scope.chartOptions = chartBuilder.chartOptions;
    }

    $scope.changeTimeSpan = function (newSpan) {
      $scope.currSpan = newSpan;
      $scope.getChartData($scope.currDisplaySymbol);
    }

    // get chart data from x months ago
    $scope.getChartData = function (symbol) {
      if (!symbol) {
        chartBuilder.allChartDataHistorical($scope.currSpan).then(function (chartData) {
          $scope.currDisplaySymbol = '';
          $scope.labels = chartData.data.labels;
          $scope.series = chartData.data.series;
          $scope.prices = chartData.data.prices;
        });
      } else {
        chartBuilder.singleChartDataHistorical($scope.currSpan, symbol).then(function (chartData) {
          $scope.currDisplaySymbol = symbol;
          $scope.labels = chartData.data.labels;
          $scope.series = chartData.data.series;
          $scope.prices = chartData.data.prices;
        });
      }
    }


    $http.get('/api/stocks').success(function(stocks) {
      $scope.stocks = stocks;
      socket.syncUpdates('stock', $scope.stocks, function () {
        $scope.getChartData();
      });
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
