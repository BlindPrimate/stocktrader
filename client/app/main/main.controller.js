'use strict';

angular.module('stocktraderApp')
  .controller('MainCtrl', function ($scope, $http, socket) {

    var init = function () {
        $scope.stocks = {};
    }


    $http.get('/api/stocks').success(function(stocks) {
      $scope.stocks = stocks;
      socket.syncUpdates('stock', $scope.stocks);
    });

    $scope.addStock = function() {
      if($scope.newStock === '') {
        return;
      }
      $http.post('/api/stocks', { symbol: $scope.newStock });
      $scope.newStock = '';
    };

    $scope.deleteStock = function(stock) {
      console.log('check');
      $http.delete('/api/stocks/' + stock._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('stock');
    });

    init();
  });
