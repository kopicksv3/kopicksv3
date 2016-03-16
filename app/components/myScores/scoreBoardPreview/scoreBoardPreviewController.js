var scoreBoardPreviewController = angular.module("scoreBoardPreviewController");

scoreBoardPreviewController.controller('scoreBoardPreviewController', ['$scope', 'clientFactory', 'normalizeScoreName', 'calculateScoreValue', '$routeParams', '$interval', '$uibModal', '$timeout', 'GenericModal', '$rootScope', 'errorFactory', function ($scope, clientFactory, normalizeScoreName, calculateScoreValue, $routeParams, $interval, $uibModal, $timeout, GenericModal, $rootScope, errorFactory) {
    //'use strict';
    $scope.scoreBoardData = {};
    $scope.focusedTeamData;
    $scope.leagueID;
    $scope.teamName = '';
    $scope.rank = '';
    $scope.ftid;
    $scope.hideScorePreview = false;
 

    /*
     * Used to determine if we should show the scoreboard link. 
     * If the route has a fantasy teamID then we are already on the scoreboard page
     */
    $scope.showScoreboardLink = (typeof $routeParams.fantasyTeamID == 'undefined');  

    /*
     * The page rendering this portion of the code needs to set this value in order
     */
    $scope.$parent.$watchCollection('focusedPreviewTeamData', function (newVal, oldVal) {
        if (typeof newVal !== 'undefined' && oldVal !== newVal) {
            $scope.ftid = newVal.fantasyTeamID;
            $scope.loadTeamData($scope.ftid);
            $scope.getLeagueData(newVal.fantasyLeagueID);
        }
    });

    /*
     * Get data for the entire league and then render the scoreboard
     */
    $scope.getLeagueData = function (flid) {
        clientFactory.fantasyLeagues().GetFantasyLeagueByID(flid)
            .done(function (fl) {
                $scope.fantasyLeague = fl;
                $scope.$apply();
                //$scope.switchScoreBoard($scope.ftid);
            }).fail(function (error) {
                FlowerCityGaming.V1.logError("An Error Has Occurred");
                errorFactory.displayErrors(error, "Error with the Scoreboard.");
            });
    };

    /*
     *  Given an array and a name. Sums all the 'prop' values in the array for each element.
     */
    $scope.sum = function (items, prop) {
        if (typeof items == 'undefined') return 0;
        return items.reduce(function (a, b) {
            return a + b[prop];
        }, 0);
    }

    /*
     * Get specefic information for the fantasy team being displayed.
     * 
     * Note: It would be great if we could avoid this call by having one of the other calls have this information
     */
    $scope.loadTeamData = function (teamID) {
        clientFactory.fantasyTeams().GetFantasyTeamByID(teamID)
        .done(function (data) {
            $scope.ytp = data.ytp;
            $scope.leagueID = data.leagueID;
            $scope.teamName = data.name;
            $scope.rank = data.ranking;
            $scope.totalPoints = data.totalScore;
            $scope.setInterval(teamID);
            $scope.getLeagueData(data.fantasyLeagueID);
            $scope.$apply();
        }).fail(function (error) {
            FlowerCityGaming.V1.logError("An Error Has Occurred");
            errorFactory.displayErrors(error, "Error with the Scoreboard.");
        });;

    };
     /*
     * When the page is signaled to be destroyed clear any intervals we setup
     */
    $scope.$on(

        "$destroy",
        function (event) {
            if (angular.isDefined($scope.refreshPromise)) {
                $interval.cancel($scope.refreshPromise);
            }
        }
    );


     /*
     * In 30 seconds refresh the scoreboard 
     */
    $scope.setInterval = function (ftid) {
        if (angular.isDefined($scope.refreshPromise)) {
            $interval.cancel($scope.refreshPromise);
        }
        $scope.refreshPromise = $interval(

        function () {
            if (typeof ftid !== 'undefined') {
                $scope.$broadcast("refreshScore", $scope.ftid);
                $scope.loadTeamData(ftid);
            }
        }, 30000, 1);
    }

    $rootScope.$on("hideScorePreview",
        function (event, isShown) {
            $scope.hideScorePreview = isShown;
        });

}]);