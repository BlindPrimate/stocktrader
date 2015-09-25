'use strict';

angular.module('stocktraderApp')
  .factory('chartBuilder', function ($http) {
    // Service logic
    // ...



    // Public API here
    
    return $http.get('api/chart');
  });
