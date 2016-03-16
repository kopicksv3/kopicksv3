
var exportLineupController = angular.module("exportLineupsController", ['angular-linq', 'ui.bootstrap']);

exportLineupController.controller('exportLineupsController', ['$scope', '$uibModal', '$uibModalInstance', '$uibModalStack', 'clientFactory','GenericModal', function ($scope, $uibModal, $uibModalInstance, $uibModalStack, clientFactory, GenericModal) {
    //'use strict';

    // Scope variables
    $scope.selectedFantasyLeagues = [];
    $scope.selectedTeamIDs = [];
        
    // Used to change the state of selected leagues ( when a user clicks on a checkbox )
    $scope.selectedFantasyLeagueState = function (fantasyLeague, selectedState) {
        var teamid = fantasyLeague.fantasyTeamID
        if (selectedState) {
            // If the league is selected, add it to the array and add up the cost of entry
            $scope.selectedFantasyLeagues.push(fantasyLeague);
            $scope.selectedTeamIDs.push(teamid);
            $scope.totalLeagueCost += fantasyLeague.entryFee;
        }
        else {
            // If the league is not unselected, remove the league from the array, and subtract the cost of entry.
            var index = $scope.selectedFantasyLeagues.indexOf(fantasyLeague);
            var indexTeam = $scope.selectedTeamIDs.indexOf(teamid);
            $scope.selectedFantasyLeagues.splice(index, 1);
            $scope.selectedTeamIDs.splice(indexTeam, 1);
            $scope.totalLeagueCost -= fantasyLeague.entryFee;
        }
    };

    // Get leagues the user belongs to that are compatible with this league to export the lineup to.
    clientFactory.fantasyLeagues().GetCompatibleFantasyLeagues($scope.exportFantasyLeagueID, $scope.exportFantasyTeamID)
    .done(function (fantasyLeagues) {
        $scope.exportableFantasyLeagues = fantasyLeagues;
        $scope.$apply();
    })
    .fail(function (error) {
        FlowerCityGaming.V1.logError("Error loading importable lineups.");
    });

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    // Dismiss the modal
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.redirectToDraftPage = function (fantasyLeagueID, fantasyTeamID) {
        // redirect to draft page
        //var url = "/#/draft/" + fantasyLeagueID + "/" + fantasyTeamID;
        //window.location.href = url;
        $scope.FantasyTeamIds = $scope.selectedTeamIDs;
        var modalInstance = $uibModal.open({
            templateUrl: 'showLineupLeaguesID.html',
            controller: 'ShowLineupLeaguesController',
            scope: $scope,
            size: 'lg'
        });
    };

    // Saves the lineup into the leagues
    $scope.saveLineup = function () {
        errorMessage = "Error saving lineup for fantasy leagues ";
        errorCount = 0;
        successMessage = "Successful saving lineup for fantasy leagues ";


        // Loop through the selected leagues and save the lineup to those leagues
        for (var i = 0; i < $scope.selectedFantasyLeagues.length; i++) {
            (function (index) {
                fantasyTeamRoster = new FlowerCityGaming.V1.Models.FantasyTeamModify(clientFactory.getAccountId(), $scope.selectedFantasyLeagues[index].fantasyTeamID, $scope.exportFantasyTeam);
                
                // Make the request to modify the team.
                clientFactory.fantasyTeams().ModifyFantasyTeam($scope.selectedFantasyLeagues[index].fantasyTeamID, fantasyTeamRoster)
                .fail(function (error) {
                    errorMessage = errorMessage + $scope.selectedFantasyLeagues[index].fantasyLeagueID + ", ";
                    errorCount++;
                    if ((index + 1) >= $scope.selectedFantasyLeagues.length) {
                        displayMessages(successMessage, errorMessage, errorCount);
                    }
                })
                .done(function (response) {
                    successMessage = successMessage + $scope.selectedFantasyLeagues[index].fantasyLeagueID + ", ";
                    if ((index + 1) >= $scope.selectedFantasyLeagues.length) {
                        displayMessages(successMessage, errorMessage, errorCount);
                    }
                });
            })(i);
        }

    }

    function displayMessages(successMessage, errorMessage, errorCount) {
        var finalString = new Array();
        var isError = true;
        // Everything errored if the number of errors equals the number of fantasy leagues
        if (errorCount >= $scope.selectedFantasyLeagues.length) {
            finalString.push(errorMessage.substring(0, errorMessage.length - 2));
        }
        else if (errorCount == 0) {
            isError = false;
            finalString.push(successMessage.substring(0, successMessage.length - 2));
        }
        else {
            finalString.push(successMessage.substring(0, successMessage.length - 2) + "\n" + errorMessage.substring(0, errorMessage.length - 2));
        }
        if (isError) {
            GenericModal.showModal('Error', finalString);
        }
        else {
            GenericModal.showModal('Success', finalString);
        }
    }
}]);