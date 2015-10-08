'use strict';

angular.module('stocktraderApp')
  .controller('MainCtrl', function ($scope, $http, socket, chartBuilder, symbolSearch) {

    var init = function () {
        $scope.currSpan = 6;
        $scope.stocks = {};
        $scope.viewingStocks = [];
        $scope.getAllStocks();
        $scope.chartOptions = chartBuilder.chartOptions;
        $scope.multiSelection = false;
        $scope.search = {
          term: '',
          results: '',
          focused: false,
          searching: false
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

    // display chart data for all currently selected stocks
    var getChartData = function () {
      chartBuilder.getChartData($scope.viewingStocks, $scope.currSpan).then(function (chartData) {
        $scope.labels = chartData.data.labels;
        $scope.series = chartData.data.series;
        $scope.prices = chartData.data.prices;
      })
    }

    // checks if symbol is currently being displayed on graph
    $scope.isCurrentlyGraphed = function (symbol) {
      if ($scope.viewingStocks.indexOf(symbol) === -1) {
        return false;
      } else {
        return true;
      }
    }

    $scope.selectAllStocks = function () {
      $scope.viewingStocks = [];
      angular.forEach($scope.stocks, function (stock) {
        $scope.viewingStocks.push(stock.symbol);
      });
    }


    // change displayed span of time of chart data
    $scope.changeTimeSpan = function (newSpan) {
      $scope.currSpan = newSpan;
    }

    // get chart data from x months ago
    $scope.selectStock = function (symbol) {
      var index = $scope.viewingStocks.indexOf(symbol);
      if ($scope.multiSelection && index === -1) {
        $scope.viewingStocks.push(symbol);
      } else if ($scope.multiSelection){
        $scope.viewingStocks.splice(index, 1);
      } else {
        $scope.viewingStocks = [symbol];
      }
    }



    // watchers
    
    // updates chart data on change of selected stocks
    $scope.$watchCollection('viewingStocks', function () {
      getChartData();
    });

    // updates chart data on change of displayed time span
    $scope.$watch('currSpan', function () {
      getChartData();
    });

    // enables live symbol search
    $scope.$watch('search.term', function () {
      $scope.getSearchResults();
    });

    // end watchers

    // retrive and display search results
    $scope.getSearchResults = function () {
      // search.searching variable keeps 'no results' from showing before http
      // data return
      $scope.search.searching = true;
      symbolSearch.search($scope.search.term).then(function (results) {
        if (results.data.length > 0) {
          $scope.search.results = results.data;
        } else {
          $scope.search.results = '';
        }
        $scope.search.searching = false;
      });
    }


    // retrieve all stock names w/ current prices
    $scope.getAllStocks = function () {
      $http.get('/api/stocks/all/current').success(function(stocks) {
        $scope.stocks = stocks;
        socket.syncUpdates('stock', $scope.stocks);
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
      $http.delete('/api/stocks/' + stock._id)
        .then(function (deletedStock) {
          $scope.viewingStocks = _.remove($scope.viewingStocks, function (symbol) {
            return symbol !== deletedStock.data.symbol;
          });
        });
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('stock');
    });

    $scope.onClick = function (points, evt) {
      console.log(points, evt);
    };

    init();
  });
