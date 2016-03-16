var LobbyGridController = angular.module('LobbyGridController', ['locationVerificationModal', 'accountModals', 'ui.slider']);

LobbyGridController.controller('LobbyGridController', ['$scope', '$http', '$window', 'clientFactory', 'locationVerificationModalService', 'accountModalService', 'getLeagueNameFilter', 'lobbyRefresher','$timeout', function ($scope, $http, $window, clientFactory, locationVerificationModalService, accountModalService, getLeagueName, lobbyRefresher,$timeout) {
    //'use strict';
    $scope.loading = true;
    $scope.fantasyLeagues = null;
    $scope.timerHandle = null;

    //The original length of the fetch of open fantasy leagues
    $scope.originalLength;
    var countdownTimer = function (scope) {
        var newTime = new Date();
        var indexes = scope.fantasyLeagues.length - 1;

        //since we might possibly be removing objects from the array iterate in reverse
        for (var i = indexes; i > -1; i--) {
            var timespan = scope.fantasyLeagues[i].draftStartDate_ms - newTime;
            var hours = Math.floor(timespan / 3600000);
            var minutes = Math.floor((timespan - hours * 3600000) / 60000);
            var seconds = Math.floor(((timespan - hours * 3600000) - minutes * 60000) / 1000);

            if (timespan <= 0) {
                scope.removeFantasyLeague(scope.fantasyLeagues[i].fantasyLeagueID);
            }
            else {
                scope.fantasyLeagues[i].countDown = ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2) + ":" + ("00" + seconds).slice(-2);
            }
        }
        scope.$apply();
        scope.timerHandle = window.setTimeout(countdownTimer, 1000, scope);
    };
   
    $scope.checkOriginal = function (fantasyLeague) {
        if (!fantasyLeague.original) {
            $timeout(function () {
                fantasyLeague.original = true;
            }, 1000);
            return true;
        }
        return false;
    };
    //function (tenantID, accountID, getSimilarFantasyLeagueID, hideFreeIfMaxed, offset, limit)
    //TODO: update to use tenantid
    lobbyRefresher.getAllOpenLeagues(4, clientFactory.getAccountId(), function (changes) {
        $scope.handleFantasyLeagueDiffs(changes);
    }, function (fantasyLeagues) {
        var newTime = new Date();
        var timespan = null;
        var hours = null, minutes = null, seconds = null;

            window.clearTimeout($scope.timerHandle);
            
            $scope.fantasyLeagues = fantasyLeagues;
            $scope.originalLength = fantasyLeagues.length;
            for (var i = 0; i < ($scope.fantasyLeagues).length; i++) {
                $scope.fantasyLeagues[i].original = true;
                $scope.fantasyLeagues[i].name = getLeagueName($scope.fantasyLeagues[i].name, $scope.fantasyLeagues[i].entryFee, $scope.fantasyLeagues[i].canOnlyBeJoinedWithTickets, $scope.fantasyLeagues[i].sizeOfPrizePool, $scope.fantasyLeagues[i].payoutCurrencyType, $scope.fantasyLeagues[i].maxNumberPlayers, $scope.fantasyLeagues[i].if_1_of_2_UserName_of_1, $scope.fantasyLeagues[i].h2H_FLIDS_Of_Group.length, $scope.fantasyLeagues[i].fantasyLeagueBettingStyleID, $scope.fantasyLeagues[i].isQualifier, $scope.fantasyLeagues[i].maxNumberEntriesPerUser);
                if ($scope.fantasyLeagues[i].maxNumberPlayers == null)
                    $scope.fantasyLeagues[i].percFill = 1;
                else
                    $scope.fantasyLeagues[i].percFill = $scope.fantasyLeagues[i].currentNumberPlayers / $scope.fantasyLeagues[i].maxNumberPlayers;

                timespan = $scope.fantasyLeagues[i].draftStartDate_ms - newTime;
                hours = Math.floor(timespan / 3600000);
                minutes = Math.floor((timespan - hours * 3600000) / 60000);
                seconds = Math.floor(((timespan - hours * 3600000) - minutes * 60000) / 1000);

                $scope.fantasyLeagues[i].countDown = ("00" + hours).slice(-2) + ":" + ("00" + minutes).slice(-2) + ":" + ("00" + seconds).slice(-2);
            }
            

            $scope.fantasyLeagues.sort(function OriginalSortComparer(b, a) {

                // PinnedToTopOfLobby on top, all else below
                if (a.pinnedToTopOfLobby && !b.pinnedToTopOfLobby) {
                    return 1;
                } else if (b.pinnedToTopOfLobby && !a.pinnedToTopOfLobby) {
                    return -1;
                }

                // Qualifiers on top, all else below
                if (a.isQualifier && !b.isQualifier) {
                    return 1;
                } else if (b.isQualifier && !a.isQualifier) {
                    return -1;
                }

                // Guaranteed on top, all else below
                if (a.guaranteed && !b.guaranteed) {
                    return 1;
                } else if (b.guaranteed && !a.guaranteed) {
                    return -1;
                }

                // Satellite on top, all else below
                if (a.isSatellite && !b.isSatellite) {
                    return 1;
                } else if (b.isSatellite && !a.isSatellite) {
                    return -1;
                }

                // Then only games that have been entered, 0/n games are all below. This sorting does not apply to Guaranteed games
                if (a.currentNumberPlayers != 0 && b.currentNumberPlayers == 0 && (!a.guaranteed && !b.guaranteed))
                    return 1;
                else if (a.currentNumberPlayers == 0 && b.currentNumberPlayers != 0 && (!a.guaranteed && !b.guaranteed))
                    return -1;

                
                
                // Then all free games at bottom
                if (a.entryFee != 0 && b.entryFee == 0)
                    return 1;
                else if (a.entryFee == 0 && b.entryFee != 0)
                    return -1;


                    // Start time ascending
                else if (a.scoringStartDate_ms != b.scoringStartDate_ms) {
                    return (a.scoringStartDate_ms < b.scoringStartDate_ms ? 1 : -1);
                }

                // If guaranteed, sort by prize
                var aPrize = a.guaranteed ? a.sizeOfPrizePool : 0;
                var bPrize = b.guaranteed ? b.sizeOfPrizePool : 0;

                if (aPrize != bPrize) {
                    return ((aPrize > bPrize ? 1 : -1));
                }

                var aIspoints = (a.payoutCurrencyType == FlowerCityGaming.V1.Constants.CURRENCY_SFP);
                var bIspoints = (b.payoutCurrencyType == FlowerCityGaming.V1.Constants.CURRENCY_SFP);
                // Otherwise put SP games at bottom
                if (aIspoints != bIspoints)
                    return (aIspoints && !bIspoints) ? (1) : (-1);

                    // Then by percentage filled
                else if (a.percFill != b.percFill)
                    return (a.percFill > b.percFill ? 1 : -1);

                else if (a.Draft != b.Draft) {
                    return (a.Draft > b.Draft ? -1 : 1);
                }
                    // Then by fee
                else if (a.entryFee != b.entryFee) {
                    return (a.entryFee > b.entryFee ? -1 : 1);

                    // Then by prize
                } else if (a.sizeOfPrizePool != b.sizeOfPrizePool)
                    return (a.sizeOfPrizePool > b.sizeOfPrizePool ? -1 : 1);

                // ORIGINALLY COMMENTED OUT IN LOBBY.JS ON MVC
                //Then by sport name
                //else if (a.Sport != b.Sport)
                //    return (a.Sport < b.Sport ? 1 : -1);

                // finally by FantasyLeagueBettingStyleID
                return (a.fantasyLeagueBettingStyleID == b.FantasyLeagueBettingStyleID ? 0: ((a.FantasyLeagueBettingStyleID < b.FantasyLeagueBettingStyleID) ? 1: -1));
                
                return (a.fantasyLeagueID - b.fantasyLeagueID);
            });


            FlowerCityGaming.V1.logMessage($scope.fantasyLeagues);
            $scope.loading = false;
            $scope.$apply();
            
            $scope.timerHandle = window.setTimeout(countdownTimer, 0, $scope);
        },
        function (error) {
            FlowerCityGaming.V1.logError(error);
        });
    

    //sorting
    $scope.sortType     = ''; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.buyinValFilter = 'ALL';
    $scope.stakeMinFilter = 0;
    $scope.stakeMaxFilter = 420;
    $scope.stake = [$scope.stakeMinFilter, $scope.stakeMaxFilter];
    $scope.leagueTypeFilterVal = null;
    $scope.durationIDFilterArr = [];
    $scope.gameTypeFilterArr = [];
    $scope.bettingStyleIDFilterArr = [];
    $scope.playerNumFilterArr = [];
    $scope.sportIDFilterArr = [];
    $scope.multiEntryFilterVal = false;
    $scope.qualifierFilterVal = false;
    $scope.satelliteFilterVal = false;
    $scope.nameSearchFilterVal = null;

    /*
     * If this gets any more complicated perhaps we could move this into the lobbyRefresher service.
     */
    $scope.handleFantasyLeagueDiffs = function(diffs)
    {
        for (var x = 0; x < diffs.length; x++) {
            var nextDiff = diffs[x];

            if (nextDiff.propertyName == 'currentNumberPlayers') {
                var fl = $scope.getFantasyLeague(nextDiff.flid);

                //if the fantasy league has the max number of players remove it otherwise update the number
                if (nextDiff.newVal >= fl.maxNumberPlayers) {
                    $timeout(function () {
                        $scope.removeFantasyLeague(nextDiff.flid);
                    })
                }
                else {
                    $timeout(function () {
                        $scope.UpdateFantasyLeagueProperty(nextDiff.flid, 'currentNumberPlayers', nextDiff.newVal);
                    })
                }
            }

            //If the fantasy league status changed and is not 'open' remove it
            if (nextDiff.propertyName == 'fantasyLeagueStatusID' &&
                nextDiff.newVal !== $fcgConstants.FantasyLeagueStatusID.OPEN) {
                    $scope.removeFantasyLeague(nextDiff.flid);
            }

            //If its a new fantasy league add it
            if(nextDiff.propertyName == 'FantasyLeague')
            {           
                $timeout(function () {
                    $scope.fantasyLeagues.push(nextDiff.newVal);
                })
            }
        }
    }
    $scope.changeStake = function (stake, minmax) {
        if (!(stake[0] == 0 && stake[1] == 0)) {
            if (minmax == 'min' || minmax == 'both') {
                if (stake[0] <= $scope.stakeMaxFilter && stake[0] >= 0)
                    $scope.stakeMinFilter = parseInt(stake[0]);
                else
                    $scope.stakeMinFilter = 0;
            }
            if (minmax == 'max' || minmax == 'both') {
                if (stake[1] >= $scope.stakeMinFilter && stake[1] <= 420)
                    $scope.stakeMaxFilter = parseInt(stake[1]);
                else
                    $scope.stakeMaxFilter = 420;
            }
            $scope.stake = [$scope.stakeMinFilter, $scope.stakeMaxFilter];
        }
    }


    $scope.clear = function () {
        $scope.buyinValFilter = 'ALL';
        $scope.stakeMinFilter = 0;
        $scope.stakeMaxFilter = 420;
        $scope.stake = [$scope.stakeMinFilter, $scope.stakeMaxFilter];
        $scope.leagueTypeFilterVal = null;
        $scope.durationIDFilterArr = [];
        $scope.gameTypeFilterArr = [];
        $scope.bettingStyleIDFilterArr = [];
        $scope.playerNumFilterArr = [];
        $scope.sportIDFilterArr = [];
        $scope.multiEntryFilterVal = false;
        $scope.qualifierFilterVal = false;
        $scope.satelliteFilterVal = false;
        $scope.nameSearchFilterVal = null;

        $(".content-lobby .btn").removeClass('active');
    }
    //Returns the fantasy league index the given fantasy league ID in our fantasy league array
    $scope.getFantasyLeagueIndex = function(flid)
    {
        return Number.parseInt($('#lobbyTable').find('#' + flid).attr('flindex'));
    }
    $scope.removeFantasyLeague = function(flid)
    {
        var index = $scope.getFantasyLeagueIndex(flid);
        $timeout(function () {
            if (typeof index !== 'undefined')
            {
                $scope.fantasyLeagues.splice(index, 1);
            }
        });
    }
    //Returns the fantasy league with the given flid in our fantasy league array
    $scope.getFantasyLeague = function(flid)
    {
        //Gets the index that this fantasy league is in our list
        var index = $scope.getFantasyLeagueIndex(flid);
        return $scope.fantasyLeagues[index];
    }
    //Updates the given fantasy league ID's given property, with the given value
    $scope.UpdateFantasyLeagueProperty = function(rowID,propertyName,value)
    {
        $timeout(function () {
            $scope.getFantasyLeague(rowID)[propertyName] = value;
        })
    }

    $scope.addLeagueTypeFilter = function (leagueType) {
        if ($scope.leagueTypeFilterVal == leagueType)
            $scope.leagueTypeFilterVal = null;
        else
            $scope.leagueTypeFilterVal = leagueType;
    }

    $scope.addSportFilter = function (leagueName) {
        var leagueid = FlowerCityGaming.V1.Constants.Leagues[leagueName];
        var idx = -1;
        idx = ($scope.sportIDFilterArr).indexOf(leagueid);
        if (idx == -1) {
            $scope.sportIDFilterArr.push(leagueid);
        }
        else {
            $scope.sportIDFilterArr.splice(idx, 1);
        }
    }

    $scope.addBettingStyleFilter = function (bettingStyle) {
        var bettingStyleID = FlowerCityGaming.V1.Constants.FantasyLeagueBettingStyleID[bettingStyle];
        var idx = -1;
        idx = ($scope.bettingStyleIDFilterArr).indexOf(bettingStyleID);
        if (idx == -1) {
            $scope.bettingStyleIDFilterArr.push(bettingStyleID);
        }
        else {
            $scope.bettingStyleIDFilterArr.splice(idx, 1);
        }
    }

    $scope.addPlayerNumFilter = function (numPlayers) {

        var idx = -1;
        idx = ($scope.playerNumFilterArr).indexOf(numPlayers);
        if (idx == -1) {
            $scope.playerNumFilterArr.push(numPlayers);
        }
        else {
            $scope.playerNumFilterArr.splice(idx, 1);
        }

        }

    $scope.addDurationIDFilter = function (durId) {
        var value = FlowerCityGaming.V1.Constants.FantasyLeagueDurationID[durId.toUpperCase()];
        var idx = -1;
        idx = ($scope.durationIDFilterArr).indexOf(value);
        if (idx == -1) {
            $scope.durationIDFilterArr.push(value);
        }
        else {
            $scope.durationIDFilterArr.splice(idx, 1);
        }
    }

    $scope.addGameType = function (gametype) {
        var idx = -1;
        idx = ($scope.gameTypeFilterArr).indexOf(gametype);
        if (idx == -1) {
            $scope.gameTypeFilterArr.push(gametype);
        }
        else {
            $scope.gameTypeFilterArr.splice(idx, 1);
        }
    }

    $scope.joinLeague = function (leagueId) {
        
        FlowerCityGaming.V1.logMessage("League joined: " + leagueId);
    }


    //accountModalService.runCashAction(function () { }); // debug only: trigger a "cash action" so they can do their verification
}]);

