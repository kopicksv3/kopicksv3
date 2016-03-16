var currentStandings = angular.module("currentStandingsController", []);



currentStandings.controller('currentStandingsController', ['$scope', 'clientFactory', '$routeParams', '$uibModal','$q', function ($scope, clientFactory, $routeParams, $uibModal,$q) {
    //'use strict';
    $scope.flteams = [];
    $scope.myTeamData;
    $scope.totalResults = 0;
    $scope.isMyTeam;
    $scope.focusedVsPlayer = {};

    $scope.swapVsPlayer = function (player) {
        if (player.fantasyTeamID == $scope.focusedVsPlayer.fantasyTeamID) {
            $scope.focusedVsPlayer = -1; // Signal that we want to hide the vs scoreboard
        }
        else {
            $scope.focusedVsPlayer = player;
        }
    };

    $scope.nextData = function(page,take)
    {
        var skip = page * take;
        return clientFactory.fantasyLeagues().GetFantasyTeamsInFantasyLeague($routeParams.fantasyLeagueID, skip, take)
            .then(function (data, listDetails) {
                $scope.flteams = $scope.flteams.concat(data);
                $scope.$apply();
                return [data, listDetails.totalResults, listDetails.totalPages];
            });
    };

    //Gets a profile photo for a user
    $scope.getProfilePhoto = function (id) {
        return $q(function (resolve, reject) {
            clientFactory.getCachedAccountByID(id)
            .done(function (accountDetails, tenantDetails) {
                resolve(accountDetails.profilePhotoUrl);
            });
        });
    };


    clientFactory.fantasyLeagues().GetFantasyTeamsInFantasyLeague($routeParams.fantasyLeagueID, 0, 20)
       .done(function (data, listDetails) {
           $scope.flteams = $scope.flteams.concat(data);
           $scope.totalResults = listDetails.totalResults;
           $scope.$apply();
       });


    clientFactory.fantasyTeams().GetFantasyTeamByID($scope.curTeam)
    .done(function (teamdata) {
        $scope.myTeamData = teamdata;
        $scope.isMyTeam = (teamdata.accountID == clientFactory.getAccountId());
        $scope.$apply();
    });


    $scope.playerSwapModal = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'universalPlayerSwap.html',
            controller:  'universalPlayerController',
            scope: $scope,
            size: 'sm',
            resolve: {

            }
        });
    };
}]);

