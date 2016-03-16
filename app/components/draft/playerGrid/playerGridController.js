var playerGrid = angular.module('playerGrid', ['positionHeaders']);

playerGrid.controller('playerGridController', ['$scope', '$routeParams', 'clientFactory', 'positionService', function ($scope, $routeParams, clientFactory, positionService) {
    //'use strict';
    $scope.matchupSelected = '';
    $scope.teamSelected = '';
    $scope.sortType = '';
    $scope.sortReverse = false;
    $scope.activePosName;
    $scope.arsBox = false;
    $scope.nflDSTPosID = FlowerCityGaming.V1.Constants.Position.NFL_DST;
    $scope.loading = true;
    $scope.originalPlayers;
    
    clientFactory.fantasyLeagues().GetFantasyLeagueByID($routeParams.leagueID)
    .done(function (league) {
        $scope.league = league;
        
        $.when(clientFactory.fantasyLeagues().GetDraftablePlayers(
            $routeParams.leagueID,
            filterField = 'Season',
            filterValue = $scope.league.currentSeason,
            filterOperator = 'eq', 'Ranking', 'asc', 0, 9999).dataOnly(), clientFactory.fantasyLeagues().GetFantasyLeagueMatchups($routeParams.leagueID).dataOnly())

        .done(function (draftablePlayers, matchups) {
            
            FlowerCityGaming.V1.logMessage(draftablePlayers);
            $scope.players = draftablePlayers;
            $scope.originalPlayers = draftablePlayers;
            $scope.matchups = matchups;
            $scope.teams = [];

            //get list of teams from matchups and sort alphabetically
            var teamArray = [];
            var i;
            for (i = 0; i < $scope.matchups.length; i++) {
                $scope.teams.push({ name: $scope.matchups[i].awayName });
                $scope.teams.push({ name: $scope.matchups[i].homeName });
            }

            $scope.teams.sort(function (a, b) {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });

            //TODO: update with current season from league info (not hardcoded)
            $scope.statYears = [];
            var currDate = $scope.league.currentSeason
            $scope.yearSelected = $scope.league.currentSeason.toString();
            $scope.statYears.push({ year: currDate });

            for (var i = 0; i < 2; i++) {
                currDate--;
                $scope.statYears.push({ year: currDate });
            }

            //inserts actual matchups according to getmatchups call (instead of getdraftableplayers matchups)
            for (var p = 0; p < ($scope.players).length; p++) {
                for (var m = 0; m < ($scope.matchups).length; m++) {
                    //players[p].teamID
                    if ($scope.players[p].statistics.teamID == $scope.matchups[m].awayTeamID || $scope.players[p].statistics.teamID == $scope.matchups[m].homeTeamID) {
                        $scope.players[p].realMatchup = $scope.matchups[m].awayAlias + "@" + $scope.matchups[m].homeAlias;
                        $scope.players[p].awayAlias = $scope.matchups[m].awayAlias;
                        $scope.players[p].homeAlias = $scope.matchups[m].homeAlias;
                        $scope.players[p].realMatchTime = $scope.matchups[m].startDate;
                    }
                }

            }

            // sets all stats that are null to the value of 0 so that can easily sort
            for (var i in $scope.players) {
                var obj = $scope.players[i];
                for (var key in obj) {
                    if (obj[key] === null) {
                        obj[key] = 0;
                    }
                }

                if (obj.statistics !== 0) {
                    for (var key2 in obj.statistics) {
                        if (obj.statistics[key2] === null) {
                            obj.statistics[key2] = 0;
                        }
                    }
                }
            }


            $scope.$emit('playerDraftOverview', draftablePlayers[0]);
            $scope.$emit('seasonOvrActivePlayer', draftablePlayers[0]);
            $scope.loading = false;
            $scope.$apply();
        }).
        fail(function (error) {
            FlowerCityGaming.V1.logMessage("playerGridController Error: " + error);
        });
    })

    $scope.clear = function () {
        $scope.searchPlayer = '';
        $scope.matchupSelected = '';
        $scope.teamSelected = '';
        $scope.yearSelected = $scope.league.currentSeason.toString();
        $scope.players = $scope.originalPlayers;
        $scope.$broadcast('getTeamMatchup', {
            matchup: $scope.matchupSelected, team: $scope.teamSelected, searchPlayer: $scope.searchPlayer
            });
    }

    $scope.onChangeYear = function (year) {
        $scope.loading = true;
        clientFactory.fantasyLeagues().GetDraftablePlayers($routeParams.leagueID, filterField = 'Season', filterValue = year, filterOperator = 'eq', '', '', 0, 9999)
        .done(function (draftablePlayers) {
            $scope.players = draftablePlayers;

            for (var p = 0; p < ($scope.players).length; p++) {
                for (var m = 0; m < ($scope.matchups).length; m++) {
                    if ($scope.players[p].statistics.teamID == $scope.matchups[m].awayTeamID || $scope.players[p].statistics.teamID == $scope.matchups[m].homeTeamID) {
                        $scope.players[p].realMatchup = $scope.matchups[m].awayAlias + "@" +$scope.matchups[m].homeAlias;
                        $scope.players[p].awayAlias = $scope.matchups[m].awayAlias;
                        $scope.players[p].homeAlias = $scope.matchups[m].homeAlias;
                        $scope.players[p].realMatchTime = $scope.matchups[m].startDate;
                    }
                }
            }
            $scope.loading = false;
            $scope.$apply();
        })
        .fail(function (error) {
            FlowerCityGaming.V1.logMessage("playerGridController Error: " + error);
        });
    }
        $scope.onChangePlayerFilter = function (matchup, team, searchPlayer) {
        $scope.$broadcast('getTeamMatchup', { matchup: matchup, team: team, searchPlayer: searchPlayer });
    }
    $scope.$on('getFantasyLineup', function (event, lineup) {
        $scope.lineup = lineup;
        if ($scope.players) {
            for (var p = 0; p < ($scope.players).length; p++) {
                for (var l = 0; l < ($scope.lineup).length; l++) {
                    
                    if ($scope.lineup[l].personID == $scope.players[p].id && $scope.players[p].id != 0) {
                        $scope.players[p].inLineup = true;
                        break;
                    }
                    else if ($scope.lineup[l].positionID == $scope.nflDSTPosID && $scope.lineup[l].personID == $scope.players[p].teamID && $scope.players[p].id == 0) {
                        $scope.players[p].inLineup = true;
                        break;
                    }
                    else {
                        $scope.players[p].inLineup = false;
                    }
                }
            }
        }
    });

    $scope.$on('onChangeArs', function (event, arsBox) {
        $scope.arsBox = arsBox;
    });

    $scope.$on('averageRemainingSalary', function (event, avgRemainSal) {
        if ($scope.arsBox) {
                $scope.avgSalary = avgRemainSal;
    }
    else {
                $scope.avgSalary = 100000;
    }
    });

    $scope.$on('sortMe', function (event, sortType) {
        $scope.sortReverse = ($scope.sortType === sortType) ? !$scope.sortReverse: false;
        $scope.usedSortType =($scope.sortReverse ? '-' : '+') +sortType;
        $scope.sortType = sortType;
    });

    $scope.$on('getActivePos', function (event, activePosName) {
        $scope.activePosName = activePosName;
    });
}]);