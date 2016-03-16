/// <reference path="scoreBoardData.html" />
var scoreBoard = angular.module('scoreBoardPreviewController');


scoreBoard.directive("scoreBoardData", ['$filter', function ($filter) {
    var directive = {};

    directive.restrict = "E";
    directive.scope = {
        teamId: '=',
        pos: '=',
        playerName: '=',
        salary: '=',
        owned: '=',
        matchup: '=',
        gameStats: '=',
        points: '=',
        leagueId: '=',
        sportId: '=',
        seasonId: '='
    };



    directive.controller = ['$scope', '$rootScope', '$filter', 'clientFactory', 'GenericModal', '$uibModal', '$interval', 'errorFactory', function ($scope, $rootScope, $filter, clientFactory, GenericModal, $uibModal, $interval, errorFactory) {
        $scope.scoreBoardData = {};
        $scope.seasonID;
        $scope.sportID;
        $scope.intervalProm;
        $scope.$watch('teamId', function (newVal, oldVal) {
            //-1 is simply an indication that the user wishes not to display this anymore.
            //Something else will handle removing it.
            if (newVal !== -1) {
                $scope.refreshScoreBoard(newVal);
            }
            else {
                $scope.$emit('toggleReady', [false, teamID]);
            }
        });


        /*
         * Gets the team roster information
         */
        $scope.refreshScoreBoard = function (teamID) {

            if (teamID < 0 || typeof teamID == 'undefined') {
                return;
            }

            clientFactory.fantasyTeams().GetRosterScoring(teamID)
                .done(function (teamdata) {
                    $scope.postProcessTeamData(teamdata);
                    $scope.scoreBoardData[teamID] = teamdata;
                    $scope.focusedTeamData = teamdata;
                    $scope.$emit('toggleReady', [true, teamID]);
                    $scope.$apply();

                }).fail(function (error) {
                    FlowerCityGaming.V1.logError("An Error Has Occurred");
                    errorFactory.displayErrors(error, "There is an error with the Scoreboard.");
                });;
        };

        //Various aggregate methods to perform on the data. Note that this will modify the passed in value.
        $scope.postProcessTeamData = function (teamData) {
            for (var x = 0; x < teamData.length; x++) {
                //We grab this data from a seperate call
                $scope.calcPlayerStats(teamData[x]);
            }
        }

        /*
         * Takes in an object representing a players stats, determines the display name of each stat, and appends it to either a negative, or positive array
         * On the passed in player object depending if the stat causes the player to lose or gain points.
         * Note: This could probably be a service
         */
        $scope.calcPlayerStats = function (playerStats) {            
            playerStats.negativeStats = [];
            playerStats.positiveStats = [];

            for (var y = 0; y < playerStats.stats.length; y++) {

                var stat = playerStats.stats[y];

                var statNameAndPoint = { "scoreName": stat.item3, "scoreAmt": Math.abs(stat.item2) }

                if (stat.item1 == '-') {
                    playerStats.negativeStats.push(statNameAndPoint);
                }
                else {
                    playerStats.positiveStats.push(statNameAndPoint);
                }
            }
        }

        /*
        *  If the user clicks on a players name open the player profile modal.
        */
        $scope.openPlayerProfile = function (player) {

            //Dont allow this operation untill our league data has loaded
            if (!$scope.focusedTeamData) {
                return;
            }

            //This needs to be done becuase of the way the stats stuff was implemtend (Do not ask me why it was done that way)
            player.sportID = $scope.sportId;
            player.currentSeason = $scope.seasonID;

            //These variables are required to be present WITH these exact names in order for the modal to work
            $scope.league = {}
            $scope.league.leagueID = $scope.leagueId;
            $scope.activePlayer = player;
            $scope.activePlayer.id = player.playerID;
            $scope.activePlayer.season = $scope.seasonId;


            modalInstance = $uibModal.open({
                templateUrl: 'playerProfileModalContent.html',
                controller: 'PlayerProfileInstanceController',
                scope: $scope,
                size: 'lg'
            });
        };

        $scope.$watchGroup(['leagueID', 'seasonID', 'sportID'], function (newVals, oldVals, scope) {
            if (typeof newVals[0] !== 'undefined' && typeof newVals[1] !== 'undefined' && typeof newVals[2] !== 'undefined') {
                $scope.refreshScoreBoard($scope.teamId);
            }
        });


        /*
         * Use this to signal that the scoreboard needs to refresh
         * 
         * Example: In the parent of this fire $scope.broadcast("refreshScore",ftid);
         */
        $scope.$on("refreshScore", function (event, ftid) {
            if (ftid === $scope.teamId)
            {
                $scope.refreshScoreBoard(ftid);
            }   
        });

    }];
    directive.templateUrl = "app/components/myScores/scoreBoardPreview/scoreBoardData.html"
    return directive;
}]);