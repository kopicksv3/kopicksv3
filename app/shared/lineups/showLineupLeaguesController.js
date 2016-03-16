var ShowLineupLeaguesController = angular.module("ShowLineupLeaguesController", ['angular-linq', 'ui.bootstrap']);
ShowLineupLeaguesController.controller('ShowLineupLeaguesController', ['$scope', '$uibModalInstance', '$modalStack', 'clientFactory', function ($scope, $uibModalInstance, $modalStack, clientFactory) {
    //'use strict';
    clientFactory.fantasyTeams().GetFantasyLeaguesByFantasyTeamIDIdArray(($scope.FantasyTeamIds).toString())
    .done(function (fantasyLeagues) {
        $scope.fantasyLeagues = fantasyLeagues;
        $scope.$apply();
    })
    .fail(function (error) {
        FlowerCityGaming.V1.logError("Error loading fantasy league information.");
    });

    $scope.redirectToDraftPage = function (fantasyLeagueID, fantasyTeamID) {
        // redirect to draft page
        $modalStack.dismissAll('cancel');
        if ($scope.ytp > 0) {
            var url = "/#/draft/" + fantasyLeagueID + "/" + fantasyTeamID;
            window.location.href = url;
        }
        else {
            var url = "/#/myScores/scoreboard/" + fantasyLeagueID + "/" + fantasyTeamID;
            window.location.href = url;
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);