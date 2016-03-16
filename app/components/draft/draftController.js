var draft = angular.module('draftModule', [
    'playerGrid',
    'draftLineup',
    'positionHeaders',
    'playerFilters',
    'playerGridDirectives',
    'profileStatsHeaderDirectives',
    'seasonOvrStatsDirectives',
    'genericModalService',
    'errorMessages',
    'fantasyLeagueServices'
]);


draft.controller('draftController', ['$scope', '$uibModal', '$routeParams', 'clientFactory', 'positionService', '$timeout', 'appConstants', '$window', 'GenericModal', 'errorFactory', 'fantasyLeagueSignaler', function ($scope, $uibModal, $routeParams, clientFactory, positionService, $timeout, appConstants, $window, GenericModal, errorFactory, fantasyLeagueSignaler) {
    //'use strict';
    $scope.loading = true;
    $scope.leagueStatusOpen = FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.OPEN;
    $scope.nflDSTPosID = FlowerCityGaming.V1.Constants.Position.NFL_DST;
    $scope.tenant = null;
    $.when(clientFactory.fantasyTeams().GetFantasyTeamByID($routeParams.fantasyTeamID), clientFactory.fantasyLeagues().GetFantasyLeagueByID($routeParams.leagueID).dataOnly(), clientFactory.tenants().GetTenantById(4).dataOnly())
            .done(function (getTeam, league, tenant) {
                if (getTeam)
                    $scope.team = getTeam[0];
                $scope.league = league;   
                //gets the positional headers
                $scope.positions = positionService.getHeaders(league.leagueID, league.fantasyDraftStyle);
                $scope.activePosID = $scope.positions[0].values;            
                $scope.activePosName = $scope.positions[0].id;
                $scope.filterPos($scope.activePosID, $scope.activePosName);
                $scope.tenant = tenant;
                $scope.loading = false;
                $scope.$apply();
        }).fail(function (error) {
            $scope.loading = false;
            // TODO: Update error handling
            errorFactory.displayErrors(error, "Error retrieving fantasy league.");
                //FlowerCityGaming.V1.logMessage("Error: " + error);
        });
    

    $scope.filterPos = function (values, posName) {
        $scope.activePosID = values;
        $scope.activePosName = posName;
        $scope.$broadcast('getActivePos', posName);
        $scope.$broadcast('getActivePosIds', values);
    };

    // Listens for player row to be clicked and shows the new active player
    $scope.$on('playerDraftOverview', function (event, player) {
        $scope.activePlayer = player;        
    });

    $scope.addPlayerToLineup = function (player) {
        $scope.$broadcast("addPlayerToLineup", player);
    };

    $scope.leaveLeague = function () {
        clientFactory.fantasyTeams().GetFantasyTeamByID($routeParams.fantasyTeamID)
        .done(function (team) {
            if (team) {
                clientFactory.fantasyTeams().DeleteFantasyTeam($routeParams.fantasyTeamID)
                .done(function (leaveLeague) {
                    clientFactory.getCachedAccountByID(clientFactory.getAccountId(), true)
                    .then(function (refreshAcct) {
                        fantasyLeagueSignaler.sendLeagueChangedMessage(clientFactory.getAccountId(), $scope.league.fantasyLeagueID)
                        $window.location.href = "/#/lobby";
                    });
                }).fail(function (error) {
                    // TODO: Better error handling needed
                    errorFactory.displayErrors(error, "Error deleting fantasy team.");
                });
            }
        })
    }


    //modal PlayerProfile
    $scope.openPlayerProfile = function () {
        
        var modalInstance = $uibModal.open({
            templateUrl: 'playerProfileModalContent.html',
            controller: 'PlayerProfileInstanceController',
            scope: $scope,
            size: 'lg'
        });       
    };

}]);

