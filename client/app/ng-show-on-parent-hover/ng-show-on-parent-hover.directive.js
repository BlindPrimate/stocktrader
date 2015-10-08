'use strict';

angular.module('stocktraderApp')
  .directive('ngShowOnParentHover', function () {
    // show element when hovering over parent element for set time -- 900ms
    return {
      restrict: 'A',
      link: function (scope, element, attrs) {
        var timeout;

        element.parent().bind('mouseenter', function () {
          timeout = setTimeout(function () {
            element.show();
          }, 900);
        });
        element.parent().bind('mouseleave', function () {
          clearTimeout(timeout);
          element.hide();
        });
      }
    };
  });
