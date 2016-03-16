var currentStandings = angular.module("scoreBoardPreviewController");

currentStandings.directive('scoreBoardPreviewVs', ['clientFactory', '$interval', '$rootScope', 'errorFactory', function (clientFactory, $interval, $rootScope, errorFactory) {
    var directive = {};
    directive.templateUrl = "app/components/myScores/scoreBoardPreview/scoreBoardPreviewVS.html";
    directive.restrict = 'E';
    directive.scope = {
        focusedVsPlayer: '=',
        myTeamData: '='
    };
   
    directive.controller = ['$scope', function ($scope) {
        $scope.focusedVsPlayer = {};
        $scope.myTeamData = {};
        $scope.myTeamClean = false;
        $scope.otherTeamClean = false;
        $scope.isShown = false;
        $scope.opponentData = {};

        $scope.$on('toggleReady', function (event, args) {
            if (args[1] == $scope.myTeamData.fantasyTeamID) {
                $scope.myTeamClean = args[0];
            }
            else if (args[1] == $scope.focusedVsPlayer.fantasyTeamID) {
                $scope.otherTeamClean = args[0];
            }

        });

        /*
        * Get data for the entire league and then render the scoreboard
        */
        $scope.getLeagueData = function (flid) {
            clientFactory.fantasyLeagues().GetFantasyLeagueByID(flid)
                .done(function (fl) {
                    $scope.fantasyLeague = fl;
                    $scope.highTeamScore = fl.highTeamScore;
                    $scope.$apply();
                }).fail(function (error) {
                    FlowerCityGaming.V1.logError("An Error Has Occurred");
                    errorFactory.displayErrors(error, "Error with the Scoreboard.");
                });
        };


        $scope.$watchCollection('myTeamData', function (newVal, oldVal) {
            if (newVal.fantasyTeamID !== oldVal.fantasyTeamID) {
                $scope.getLeagueData(newVal.fantasyLeagueID, $scope.myTeamData);
                $scope.loadTeamData(newVal.fantasyTeamID, $scope.myTeamData);
            }

        });



        /*
         * The parent controller has changed who the opponent's score is.
         */
        $scope.$watchCollection('focusedVsPlayer', function (newVal, oldVal) {
            if (newVal != oldVal) {
                if (newVal == -1) {
                    $scope.isShown = false;
                    
                }
                else {
                    if (newVal.fantasyTeamID !== $scope.myTeamData.fantasyTeamID) {
                        $scope.loadTeamData(newVal.fantasyTeamID, $scope.opponentData)
                        $scope.opponentData.profilePic = newVal.teamPhotoUrl;
                        $scope.isShown = true;
                    }
                    else {
                        $scope.isShown = false;
                    }
                    
                }
                $rootScope.$emit('hideScorePreview', $scope.isShown);
            }

        });

        /*
        * Get specefic information for the fantasy team being displayed.
        * 
        * Note: It would be great if we could avoid this call by having one of the other calls have this information
        */
        $scope.loadTeamData = function (teamID,obj) {
            clientFactory.fantasyTeams().GetFantasyTeamByID(teamID)
            .done(function (data) {
                obj.ytp = data.ytp;
                obj.leagueID = data.leagueID;
                obj.teamName = data.name;
                obj.rank = data.ranking;
                obj.totalPoints = data.totalScore;
                $scope.getLeagueData(data.fantasyLeagueID);
                $scope.$apply();
                $scope.resetInterval($scope.myTeamData.fantasyTeamID, $scope.focusedVsPlayer.fantasyTeamID);
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

        $scope.resetInterval = function (myTeamID, otherTeamID) {
            if (angular.isDefined($scope.refreshPromise)) {
                $interval.cancel($scope.refreshPromise);
            }
            $scope.refreshPromise = $interval(
                
            function () {
                if (typeof myTeamID !== 'undefined') {
                    $scope.$broadcast("refreshScore", myTeamID);
                    $scope.loadTeamData(myTeamID, $scope.myTeamData);
                    
                }
                if (typeof otherTeamID !== 'undefined') {
                    $scope.$broadcast("refreshScore", otherTeamID);
                    $scope.loadTeamData(otherTeamID, $scope.opponentData);
                }
            }, 30000,1);
        }


        $scope.playerSwapModal = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'universalPlayerSwap.html',
                controller: 'universalPlayerController',
                scope: $scope,
                size: 'sm',
                resolve: {
                }
            });
        };
    }];


    return directive;


}]);