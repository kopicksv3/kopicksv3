var lobbyModule = angular.module('fantasyLeagueServices');

/*
 * This directive causes a flash of an html element any time you change its 'value' parameter.
 *  
 * The color of the flash can be changed via the lobbyRefresher.css file.
 */
lobbyModule.directive('flashonchange', ['$timeout',function ($timeout) {
    //'use strict';
    function link(scope, element, attrs) {

        //controls wether or not the flash will occour when the element initially loads
        var first = true;

        //Watch the value property passed in if it changes flash the element
        scope.$watch('value', function (newVal, oldVal) {
            if (first) {
                first = false;
            }
            else {
                //Apply the flash class for 1 second
                $(element).addClass('flash');
                $timeout(function () {
                    element.removeClass('flash');
                }, 1000);
            }
        });
    }
    return {
        restrict: 'A',
        scope: {
            value: '='
        },
        template: '{{value}}',
        link: link

    };
}]);