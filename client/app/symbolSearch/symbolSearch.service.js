'use strict';

angular.module('stocktraderApp')
  .factory('symbolSearch', function ($http) {
    // retrives symbol search JSON data from markit api

    var url = 'http://dev.markitondemand.com/Api/v2/Lookup/jsonp?input='

    // Public API here
    return {
      search: function (query) {
        return $http.jsonp(url + query + '&jsoncallback=JSON_CALLBACK');
      }
    };
  });
