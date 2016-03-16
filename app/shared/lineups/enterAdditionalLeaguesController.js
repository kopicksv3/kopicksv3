var enterAdditionalLeaguesController = angular.module("enterAdditionalLeaguesController", ['angular-linq', 'ui.bootstrap', 'errorMessages', 'genericModalService', 'almHelper', 'errorMessages']);

enterAdditionalLeaguesController.controller('enterAdditionalLeaguesController', ['$scope', '$uibModalInstance', '$uibModalStack', 'clientFactory', 'GenericModal', 'errorFactory', 'almNamingService', 'errorFactory', function ($scope, $uibModalInstance, $uibModalStack, clientFactory, GenericModal, errorFactory, almNamingService, errorFactory) {
    //'use strict';

    // Runs when the controller loads
    // Get the account information
    clientFactory.accounts().GetAccountByID(clientFactory.getAccountId())
    .done(function (account) {
        $scope.account = account;
    });

    // Gets the leagues that are compatible with the fantasy league the person is in.
    clientFactory.fantasyLeagues().GetOpenFantasyLeagues(4, clientFactory.getAccountId(), $scope.exportFantasyLeagueID, null, null, null)
    .done(function (fantasyLeagues) {
        fantasyLeagues = almNamingService.setLeagueNames(fantasyLeagues);        
        $scope.similarFantasyLeagues = fantasyLeagues;
        $scope.$apply();
    })
    .fail(function (error) {
        errorFactory.displayErrors(error, 'An error has occured trying to get leagues.');        
    });

    // The sort type
    $scope.sortType = ''; // The default sort type is nothing
    $scope.sortReverse = false; // Sets the default sort order

    // The array that will hold any selected leagues
    $scope.selectedFantasyLeagues = [];
    // The total cost of all the selected variables
    $scope.totalLeagueCost = 0.00;

    // Used to change the state of selected leagues ( when a user clicks on a checkbox )
    $scope.selectedFantasyLeagueState = function (fantasyLeague, selectedState) {        
        selectedState = !selectedState;
        if (selectedState) {
            // If the league is selected, add it to the array and add up the cost of entry
            $scope.selectedFantasyLeagues.push(fantasyLeague);
            $scope.totalLeagueCost += fantasyLeague.entryFee;
            for (var i = 0; i < $scope.similarFantasyLeagues.length; i++) {
                if ($scope.similarFantasyLeagues[i].fantasyLeagueID == fantasyLeague.fantasyLeagueID) {
                    $scope.similarFantasyLeagues[i].selectedState = true;
                }
            }
        }
        else {
            // If the league is not unselected, remove the league from the array, and subtract the cost of entry.
            var index = $scope.selectedFantasyLeagues.indexOf(fantasyLeague);
            $scope.selectedFantasyLeagues.splice(index, 1);
            $scope.totalLeagueCost -= fantasyLeague.entryFee;
            for (var i = 0; i < $scope.similarFantasyLeagues.length; i++) {
                if ($scope.similarFantasyLeagues[i].fantasyLeagueID == fantasyLeague.fantasyLeagueID) {
                    $scope.similarFantasyLeagues[i].selectedState = false;
                }
            }
        }
    };
    
    // Saves the lineup into the leagues
    $scope.submitLineups = function () {
        var joinResponses = [];
        var completed = 0;
        for (var i = 0; i < $scope.selectedFantasyLeagues.length; i++) {
            // Create the response skelton
            response = {
                'fantasyLeagueID': $scope.selectedFantasyLeagues[i].fantasyLeagueID,
                'fantasyTeamID': null,
                'message': null
            };
            //captures the value of i and stores it in index and response, used for stuff after the api calls
            (function (index, response) {
                // Loop through and join each league
                clientFactory.fantasyTeams().CreateFantasyTeam({
                    accountID: clientFactory.getAccountId(),
                    fantasyleagueid: $scope.selectedFantasyLeagues[index].fantasyLeagueID,
                    currencytype: 2, // hardcoded to USD to get this thing rolling - BakeShow
                    useticket: false
                })
                 // If the response was successful
                .done(function (createFTResult) {
                    // sets fantasyTeamID                    
                    response['fantasyTeamID'] = createFTResult.resourceIdentifier;

                    joinResponses.push(response);
                    completed++;
                    // If this is the last request, call the validation function
                    if (completed >= $scope.selectedFantasyLeagues.length) {
                        validateJoinFantasyLeagues(joinResponses);
                        clientFactory.getCachedAccountByID(clientFactory.getAccountId(), true);
                    }
                })
                 // If the response failed
                .fail(function (error) {
                    var message = errorFactory.getErrorMessage(error.message);

                    response.message = "Error joining " + $scope.selectedFantasyLeagues[index].name + ": " + message;
                    joinResponses.push(response);
                    completed++;
                    // If this is the last request, call the validation function
                    if (completed >= $scope.selectedFantasyLeagues.length) {
                        validateJoinFantasyLeagues(joinResponses);
                    }
                });
            })(i, response);
        }


    }

    validateJoinFantasyLeagues = function (joinResponses) {
        modifyResponses = [];        

        // Loop through each response from the join fantasy leagues calls
        for (var i = 0; i < joinResponses.length; i++) {
            response = {                
                'fantasyLeagueID': joinResponses[i].fantasyLeagueID,
                'fantasyTeamID': joinResponses[i].fantasyTeamID,
                'message': joinResponses[i].message
            };

            //captures the value of i and stores it in index and response, used for stuff after the api calls
            (function (index, response) { 
                // When you have successful join the league, you need to send the lineup we want for that league
                if (joinResponses[index].message == null) {

                    fantasyTeamRoster = new FlowerCityGaming.V1.Models.FantasyTeamModify(clientFactory.getAccountId(), joinResponses[index].fantasyTeamID, $scope.exportFantasyTeam);
                    
                    clientFactory.fantasyTeams().ModifyFantasyTeam(joinResponses[index].fantasyTeamID, fantasyTeamRoster)
                    .done(function (result) {                        
                        response.message = "Successfully joined league " + $scope.selectedFantasyLeagues[index].name;
                        modifyResponses.push(response);
                        if ((index + 1) >= joinResponses.length) {
                            validateModifyLineup(modifyResponses);
                        }
                    })
                    .fail(function (error) {
                        var message = errorFactory.getErrorMessage(error.message);
                        response.message = "Error joining " + $scope.selectedFantasyLeagues[index].name + ": " + message;
                        modifyResponses.push(response);
                        // If this is the last request, call the validation function
                        if ((index + 1) >= joinResponses.length) {
                            validateModifyLineup(modifyResponses);
                        }
                    });
                }
                else {
                    modifyResponses.push(response);
                    if ((index + 1) >= joinResponses.length) {
                        validateModifyLineup(modifyResponses);
                    }
                }
            })(i, response);
        }
    }

    validateModifyLineup = function (modifyResponses) {
        var finalString = new Array();        
        // Loop through each response from the join fantasy leagues calls
        for (var i = 0; i < modifyResponses.length; i++) {
            finalString.push(modifyResponses[i].message + "\n");            
        }               

        GenericModal.showModal('Alert', finalString);
        $uibModalStack.dismissAll('cancel');
    }

    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    }

    // Dismiss the modal
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }
}]);
