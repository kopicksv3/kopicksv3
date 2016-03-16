var carousel = angular.module('carousel', []);

carousel.directive('disableAnimation', function ($animate) {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $attrs.$observe('disableAnimation', function (value) {
                $animate.enabled($element.parent(), !value);
            });
        }
    };
});


carousel.directive('pagedcarousel', ['$timeout', '$q', '$interval', function ($timeout, $q, $interval) {
    //'use strict';


    //Generates a uniqe guid - These are used in case the client does not specify a uniqe id for the id of the carousel.
    function generateUUID() {
        var d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += window.performance.now(); //use high-precision timer if available
        }
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    }
    //This is the actual logic for the carousel
    return {
        //Variables used in the directive
        scope: {
            limit: '=',
            listdata: '=?',
            elementclass: '=',
            parentclass: '=',
            carouselid: '=?',
            dataloadFn: '&',       //The function to call that gets our new data. Needs to take be of the form myFuc(page,limit) and return a promise
            intervalUpdate: '@'    //If supplied represents the amount of time we want to pass by before reloading the data, 
        },

        controller: function ($scope) {
            $scope.carouselid = angular.isDefined($scope.carouselid) ? $scope.carouselid : generateUUID();
            $scope.dataProvided = angular.isDefined($scope.listdata);
            $scope.intervalUpdate = (angular.isDefined($scope.intervalUpdate) && !angular.isDefined($scope.listdata)) ? $scope.intervalUpdate : null
            $scope.listdata = angular.isDefined($scope.listdata) ? $scope.listdata : [];


        },
        link: function ($scope, elm, attrs) {
            $scope.searched = {};
            $scope.total = -1;
            $scope.totalPages = 0;
            $scope.curPage = -1;
            $scope.results = {};
            $scope.initialized = false;

            //Methods to go to the next or previous carousel page
            $scope.goRight = function () {
                $('#' + $scope.carouselid).carousel('next');
            };
            $scope.test2 = 2000;
            $scope.goLeft = function () {
                $('#' + $scope.carouselid).carousel('prev');
  
            };

            //If an update time was provided
            if ($scope.intervalUpdate)
            {
                //For all data we alreaddy have every $scope.intervalUpdate seconds update it
                $scope.intervalPromise = $interval(function () {
                    $scope.dataloadFn()(0, $scope.total)
                    .then(function (data) {
                        var numPages = Math.ceil(data[1] / $scope.limit);
                        var i, j
                        var index = 0;
                        var chunk = $scope.limit;
                        var tempArray = [];

                        //Loop through all the values and seperate them into pages
                        for (i = 0, j = data[0].length; i < j; i += chunk, index++) {
                            tempArray[index] = (data[0].slice(i, i + chunk));
                        }

                        $scope.listdata = data[0];

                        $scope.results = tempArray;
                        $scope.$apply();
                    });
                }, $scope.intervalUpdate);
            }
            $scope.$on('$destroy', function () {
                if (angular.isDefined($scope.intervalPromise)) {
                    $interval.cancel($scope.intervalPromise);
                }
            });

            //True if we have already fetched this page from the server
            $scope.havePage = function (page) {
                return $scope.searched[page] || $scope.listdata.length == $scope.total;
            };

            //Either swipes right or fetches the next page and swipes right if we dont have it already.
            //Page - The next page we are going to.
            //limit - How many results we show on each page
            //resolve - A method that resovles a promise. (essentially informs caller all work is done)
            $scope.fetchNext = function (page, limit, resolve) {
                if ($scope.havePage(page)) {
                    $scope.goRight();
                    $scope.delayedResolve(resolve);
                }
                else {

                    $scope.searched[page] = true;
                    $scope.dataloadFn()(page, limit)
                    .then(function (data) {
                        $scope.total = data[1];
                        $scope.results[page] = data[0];
                        $scope.totalPages = data[2];
                        $scope.reparseList(page, data[0]);
                        $scope.delayedResolve(resolve);

                    });
                }
            };


            //Logic that makes sure we are on the correct page.
            //This essentially makes sure that when retreiving data from a promise we dont allow the user to go too far ahead
            $scope.reparseList = function (page, data) {
                //Get the next pages and previous page indexes
                var previous = (page - 1);
                var next = (page + 1);
                previous = (previous === -1) ? $scope.totalPages : previous;
                next = (next === $scope.totalPages + 1) ? 0 : next;


                //There is data behind this one still loading, or we are on the first result. Just return.
                if (!$scope.results[previous] && $scope.initialized) {
                    return;
                }
                else {

                    //Append this data to the list since we have the data before this element
                    $scope.listdata = $scope.listdata.concat(data);
                    $scope.$apply();
                    $scope.initialized = true;
                    $scope.goRight();
                }

                //Check if there is data in front of me that needs to be added to the carousel
                if ($scope.results[next]) {
                    $scope.reparseList(next, $scope.results[next]);
                }
            };

            //Resolves the given promise after 600 miliseconds.
            //this is needed otherwise users can spam the next button and mess up the carousel
            $scope.delayedResolve = function (resolve) {
                setTimeout(function () {
                    resolve();
                }, 600);
            };

            $scope.nextData = function () {
                return $q(function (resolve, reject) {
                    if ($scope.dataProvided) {
                        $scope.goRight();
                        resolve();
                        return;
                    }
                    $scope.curPage++;
                    $scope.fetchNext($scope.curPage, $scope.limit, resolve);
                });
            };


            $scope.previousData = function () {

                return $q(function (resolve, reject) {
                    if ($scope.dataProvided) {
                        $scope.goLeft();
                        resolve();
                        return;
                    }

                    $scope.curPage--;
                    $scope.goLeft();
                    $scope.delayedResolve(resolve);
                });
            };

            $scope.nextData();
        },
        templateUrl: '/app/shared/carousels/carouselTemplate.html',
        transclude: true,
        restrict: 'A'
    };
}]);

//Directive to hide both clickable arrows in the carousel
carousel.directive('clickAndDisable', function () {
    //'use strict';
    return {
        scope: {
            clickAndDisable: '&'
        },
        link: function (scope, iElement, iAttrs) {
            iElement.bind('click', function () {
                iElement.parent().find('.carousel-control').prop('hidden', true);
                scope.clickAndDisable().finally(function () {
                    iElement.parent().find('.carousel-control').prop('hidden', false);
                });
            });
        }
    };
});