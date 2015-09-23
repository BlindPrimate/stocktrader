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


      $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

    init();
  });
