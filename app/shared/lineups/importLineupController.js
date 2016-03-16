var importLineupController = angular.module("importLineupsController", ['angular-linq', 'ui.bootstrap', 'genericModalService', 'errorMessages']);

importLineupController.controller('importLineupsController', ['$scope', '$rootScope', '$uibModalInstance', '$uibModalStack', 'clientFactory', 'GenericModal', 'errorFactory', function ($scope, $rootScope, $uibModalInstance, $uibModalStack, clientFactory, GenericModal, errorFactory) {
    //'use strict';

    $scope.form = {
        league : null
    };
    $scope.salRemaining = 100000;
        
    // Make the call to get leagues that are compatibable.
    clientFactory.fantasyLeagues().GetCompatibleFantasyLeagues($scope.importFantasyLeagueID, $scope.importFantasyTeamID)
    .done(function (fantasyLeagues) {
        $scope.importableFantasyLeagues = fantasyLeagues;
        $scope.$apply();
    })
    .fail(function (error) {
        FlowerCityGaming.V1.logError("Error loading importable lineups.");
    });

    $scope.importLineup = function (fantasyTeamID) {
        clientFactory.fantasyTeams().GetFantasyTeamByID($scope.form.league.fantasyTeamID)
        .done(function (fantasyTeam) {
            $scope.importFantasyTeam = fantasyTeam.lineup;
            $scope.importFantasyTeamInfo = fantasyTeam;
            $scope.salRemaining = 100000;
            var salarySum = 0;
            var i;
            for (i = 0; i < $scope.importFantasyTeam.length; i++) {
                salarySum = salarySum + $scope.importFantasyTeam[i].salary;
            }
            $scope.salRemaining = $scope.salRemaining - salarySum;
            $scope.$apply();
        })
        .fail(function (error) {
            FlowerCityGaming.V1.logError("Error getting fantasy team");
        });
    };

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.saveLineup = function () { 
        var fantasyTeamRoster = new FlowerCityGaming.V1.Models.FantasyTeamModify(clientFactory.getAccountId(), $scope.importFantasyTeamID, $scope.importFantasyTeam);
        
        var message = [];
        var errorMessage = "Error saving lineup for fantasy leagues ";
        var successMessage = "Successful saving lineup for fantasy leagues ";
        var isError = true;

        // Make the request to modify the team.
        clientFactory.fantasyTeams().ModifyFantasyTeam($scope.importFantasyTeamID, fantasyTeamRoster)
        .fail(function (error) {
            message.push(errorMessage + $scope.form.league.fantasyLeagueID);
            displayMessages(message, isError);
        })
        .done(function (response) {
            isError = false;
            message.push(successMessage + $scope.form.league.fantasyLeagueID);
            displayMessages(message, isError);
            $rootScope.$broadcast("savedLineup", $scope.importFantasyTeam);
        });        
    };

    function displayMessages(message, isError) {
        if (isError) {
            errorFactory.displayErrors(message, "Error Importing Lineup.");
        }
        else {
            GenericModal.showModal('Success', message);
        }
    }

    // Dismiss the modal
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);