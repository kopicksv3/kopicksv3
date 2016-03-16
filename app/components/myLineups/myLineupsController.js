var LineupsController = angular.module("LineupsController", ['angular-linq', 'ui.bootstrap', 'genericModalService', 'errorMessages']);

// TODO: Include controller for Universal Player Swap

LineupsController.controller('LineupsController', ['$scope', 'clientFactory', '$linq', '$uibModal', 'GenericModal', 'errorFactory', function ($scope, clientFactory, $linq, $uibModal, GenericModal, errorFactory) {
    //'use strict';
    $scope.loading = true;

        $scope.ParseStatusFilters = function (data, field) {           
            return $linq.Enumerable().From(data)
                .Where(function (x) {
                    return x[field] == true;
                }).Count();                           
        };

        //League Filters
        $scope.SelectedLeagueFilters = [];
        $scope.FantasyTeamIds = [];

        $scope.SetFantasyTeamIds = function (fantasyTeamIds, ytp) {
            $scope.FantasyTeamIds = fantasyTeamIds;
            $scope.ytp = ytp;
        };

        $scope.SetLeagueFilter = function (lid) {
            
            if ($scope.SelectedLeagueFilters.length == 0 || $scope.SelectedLeagueFilters.indexOf(lid) == -1)
                $scope.SelectedLeagueFilters.push(lid)
            else
                $scope.SelectedLeagueFilters = $scope.SelectedLeagueFilters.splice(lid, 1);
        };

        $scope.FilterByLeague = function (item) {
            if($scope.SelectedLeagueFilters.length == 0)
                return true;
            else
                return ($scope.SelectedLeagueFilters.indexOf(item.leagueID) != -1);
        };

        $scope.IsLeagueFilterActive = function (lid) {
            return ($scope.SelectedLeagueFilters.indexOf(lid) != -1);
        };

        //Status Filters
        $scope.SelectedStatusFilters = [];

        $scope.SetStatusFilter = function (status) {

            if ($scope.SelectedStatusFilters.length == 0 || $scope.SelectedStatusFilters.indexOf(status) == -1) {
                $scope.SelectedStatusFilters.push(status);
            }
            else {
                
                if ($scope.SelectedStatusFilters.length > 1)
                    $scope.SelectedStatusFilters = $scope.SelectedStatusFilters.splice($scope.SelectedStatusFilters.indexOf(status) - 1, 1);
                else
                    $scope.SelectedStatusFilters = [];                            
            }            
        };

        $scope.FilterByStatus = function (item) {
            if ($scope.SelectedStatusFilters.length == 0)
                return true;
            else
            {
                for (var z = 0; z < $scope.SelectedStatusFilters.length; z++)
                {
                    if (item[$scope.SelectedStatusFilters[z]] == true)
                        return true;
                }
                return false;
            }            
        };

        $scope.IsStatusFilterActive = function (status) {
            return ($scope.SelectedStatusFilters.indexOf(status) != -1);
        };
        //------------

        $scope.leagues = FlowerCityGaming.V1.Constants.Leagues;
        $scope.leagues = $linq.Enumerable().From($scope.leagues).ToArray();
        var half_length = Math.ceil($scope.leagues.length / 2);
        $scope.leagues = $scope.leagues.splice(0, half_length);

        clientFactory.accounts().GetActiveFantasyTeamsForAccount(clientFactory.getAccountId())
        .done(function (teamsdata) {


            // Remove the dates that we previously filtered out - Past 24 hours after they end
            $scope.TeamsData = teamsdata;

            //load league filters
            $scope.LeagueFilter = [];
            for (var q = 0; q < $scope.leagues.length; q++) {
                var leagueint = parseInt($scope.leagues[q].Key);
                var cnt = $linq.Enumerable().From($scope.TeamsData)
                .Where(function (x) {
                    return x.leagueID == leagueint
                }).Count();
                if (cnt > 0) {
                    $scope.LeagueFilter.push({ lid: leagueint, num: cnt });
                }
            }
            //load status filters
            $scope.StatusFilter = [];

            var cnt2 = $scope.ParseStatusFilters($scope.TeamsData, 'isUpcoming');
            if (cnt2 > 0) {
                $scope.StatusFilter.push({ status: 'UPCOMING', num: cnt2, fieldname: 'isUpcoming' })
            }
            cnt2 = $scope.ParseStatusFilters($scope.TeamsData, 'isLive');
            if (cnt2 > 0)
                $scope.StatusFilter.push({ status: 'LIVE', num: cnt2, fieldname: 'isLive' })

            cnt2 = $scope.ParseStatusFilters($scope.TeamsData, 'isFinal');
            if (cnt2 > 0)
                $scope.StatusFilter.push({ status: 'FINAL', num: cnt2, fieldname: 'isFinal' })
            $scope.loading = false;
            $scope.$apply();
            
        })
        .fail(function (error) {
            $scope.loading = false;
            FlowerCityGaming.V1.logError("Error loading team data");
            errorFactory.displayErrors(error, "Error Loading Lineups");
            $scope.$apply();
        });

        $scope.ParseGameStatus = function (teamdata) {
            if (teamdata.isLive == true)
                return "Live!";
            else if (teamdata.isFinal == true)
                return "Final";
            else if (teamdata.isUpcoming == true)
                return "Upcoming";
        };

        $scope.editLineup = function (fleagueid,fteamid) {
            FlowerCityGaming.V1.logMessage('editLineup');
        };

        $scope.showLeaguesModals = function () {
            
            var modalInstance = $uibModal.open({
                templateUrl: 'showLineupLeaguesID.html',
                controller: 'ShowLineupLeaguesController',
                scope: $scope,
                size: 'lg'
            });
        };

        $scope.showExportModals = function (fantasyLeagueID, sportID, fantasyTeamID, fantasyTeam) {
            // exported scope variables
            $scope.exportFantasyLeagueID = fantasyLeagueID;
            $scope.exportFantasyTeamID = fantasyTeamID;
            $scope.exportFantasyTeam = fantasyTeam;
            $scope.exportSportID = sportID;

            var modalInstance = $uibModal.open({
                templateUrl: 'exportLineups.html',
                controller: 'ExportLeaguesController',
                scope: $scope,
                resolve: {
                    items: function () {
                        return $scope.items;
                    }
                }
            });
        }
        
        $scope.universalPlayerSwap = function () {
            FlowerCityGaming.V1.logMessage('universalPlayerSwap');
        };

        $scope.scoreboard = function (fleagueid, fteamid) {
            var url = "/#/myScores/scoreboard/" + fleagueid + "/" + fteamid;
            window.location.href = url;
        };
    
}]);

LineupsController.controller('ExportLeaguesController', ['$scope', '$uibModalInstance', '$uibModal', 'clientFactory', function ($scope, $uibModalInstance, $uibModal, clientFactory) {
    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    }

    $scope.enterMoreLeagues = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'enterAdditionalLeaguesID.html',
            controller: 'enterAdditionalLeaguesController',
            scope : $scope,
            size: 'lg',
        });
    };

    $scope.exportLineupToOtherLeagues = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'exportLineupsID.html',
            controller: 'exportLineupsController',
            scope : $scope,
            size : 'lg',
        });
    };
}]);
