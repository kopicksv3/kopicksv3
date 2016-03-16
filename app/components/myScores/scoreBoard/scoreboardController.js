var scoreboardController = angular.module("scoreboardController", ['errorMessages']);

scoreboardController.controller('scoreboardController', ['$scope', 'clientFactory', '$routeParams', 'userLeaguesCache', 'GenericModal', 'errorFactory', function ($scope, clientFactory, $routeParams, userLeaguesCache, GenericModal, errorFactory) {
    //'use strict';
    $scope.curTeam = $routeParams.fantasyTeamID;
    $scope.focusedPreviewTeamData;
    $scope.activeLeagues;


    userLeaguesCache.getActiveLeagues(clientFactory.getAccountId(), true, true)
    .then(function (activeLeagues) {
        //Watches our active leagues array and updates various fields
        $scope.activeLeagues = activeLeagues;
    },function (error) {
        FlowerCityGaming.V1.logError("An Error Has Occurred");
        errorFactory.displayErrors(error, "Error with Scoreboard");
    });
    clientFactory.fantasyTeams().GetFantasyLeaguesByFantasyTeamIDIdArray([$scope.curTeam])
        .done(function (data) {
            data[0].fantasyTeamID = $scope.curTeam;
            $scope.focusedPreviewTeamData = data[0];
        })
        .fail(function(error){
                FlowerCityGaming.V1.logError("An Error Has Occurred");
                errorFactory.displayErrors(error, "Error with Scoreboard");
        });




}]);