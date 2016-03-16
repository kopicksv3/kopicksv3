var sharedDirectives = angular.module('SharedDirectives', []);

//sharedDirectives
sharedDirectives.directive('sgclick', ['$parse', function ($parse) {
    //'use strict';
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var fn = $parse(attr['sglclick']);            
            var delay = 200, clicks = 0, timer = null;
            element.on('click', function (events) {                
                clicks++;
                if (clicks === 1) {
                    timer = setTimeout(function () {                        
                        scope.$apply(function () {
                            fn(scope, { $event: event });
                        });
                        clicks = 0;
                    }, delay);
                } else {
                    clearTimeout(timer);
                    clicks = 0;
                }
            });
        }
    };
}]);