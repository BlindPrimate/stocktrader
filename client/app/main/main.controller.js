'use strict';

angular.module('stocktraderApp')
  .controller('MainCtrl', function ($scope, $http, socket, chartBuilder, symbolSearch) {

    var init = function () {
        $scope.currSpan = 6;
        $scope.currDisplaySymbol = '';
        $scope.stocks = {};
        $scope.getChartData();
        $scope.getAllStocks();
        $scope.chartOptions = chartBuilder.chartOptions;
        $scope.search = {
          term: '',
          results: [],
          focused: false
        }
    }

    // check if symbol already present in list of stocks
    var isSymbolMatch = function (symbol) {
      for (var i = 0; i < $scope.stocks.length; i++) {
        if ($scope.stocks[i].symbol === symbol) {
          return true;
        }
      }
      return false
    }


    // change displayed span of time of chart
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

    $scope.getSearchResults = function () {
      symbolSearch.search($scope.search.term).then(function (results) {
        if (results.data.length > 0) {
          $scope.search.results = results.data;
        } else {
          $scope.search.results = [];
        }
      });
    }


    // enables live symbol search
    $scope.$watch('search.term', function () {
      $scope.getSearchResults();
    });

    // retrieve all stock names w/ current prices
    $scope.getAllStocks = function () {
      $http.get('/api/stocks/all/current').success(function(stocks) {
        $scope.stocks = stocks;
        socket.syncUpdates('stock', $scope.stocks, function () {
          $scope.getChartData();
          $scope.getAllStocks();
        });
      });
    }

    $scope.addStock = function(stockObj) {
      if(isSymbolMatch(stockObj.Symbol)) {
        return;
      }
      $scope.search.term = $scope.search.term.toUpperCase();
      $http.post('/api/stocks', 
          { symbol: stockObj.Symbol,
            name: stockObj.Name,
            exchange: stockObj.Exchange
          });
      $scope.search.term = '';
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
