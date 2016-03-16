 var lobbyFilters = angular.module("LobbyFilters", []);

lobbyFilters.filter('buyinFilter', function () {
    //'use strict';
    return function (fantasyLeagues, buyin) {
        var filtered = [];
        if (!fantasyLeagues || !buyin) {
            return fantasyLeagues;
        }
        //ALL - returns all fantasyLeagues
        if (buyin == 'ALL') {
            return fantasyLeagues;
        }

        //CASH
        if (buyin == 'CASH') {
            for (var i = 0; i < fantasyLeagues.length; i++) {
                if (fantasyLeagues[i].entryFee > 0) {
                    filtered.push(fantasyLeagues[i]);
                }
            }
        }

        //FREE
        if (buyin == 'FREE') {
            for (var i = 0; i < fantasyLeagues.length; i++) {
                if (fantasyLeagues[i].entryFee == 0) {
                    filtered.push(fantasyLeagues[i]);
                }
            }
        }

        //POINTS
        if (buyin == 'POINTS') {
            for (var i = 0; i < fantasyLeagues.length; i++) {
                if (fantasyLeagues[i].payoutCurrencyType == FlowerCityGaming.V1.Constants.CURRENCY_SFP) {
                    filtered.push(fantasyLeagues[i]);
                }
            }
        }

        return filtered;
    }
});

lobbyFilters.filter('leagueTypeFilter', function () {
    return function (fantasyLeagues, leaguetype) {
        var filtered = [];
        if (!fantasyLeagues || !leaguetype) {
            return fantasyLeagues;
        }
        FlowerCityGaming.V1.logMessage(leaguetype);
        //DAILY/WEEKLY
        if (leaguetype == 'DAILYWEEKLY') {
            for (var i = 0; i < fantasyLeagues.length; i++) {
                if (fantasyLeagues[i].fantasyLeagueDurationID != 4 && fantasyLeagues[i].fantasyLeagueDurationID != 6) {
                    filtered.push(fantasyLeagues[i]);
                }
            } 

        }

        if (leaguetype == 'TURBO') {
            for (var i = 0; i < fantasyLeagues.length; i++) {
                if (fantasyLeagues[i].fantasyDraftStyleID == 3) {
                    //filtered.push(fantasyLeagues[i]);
                }
            }
        }
        
        return filtered;
    }
});

lobbyFilters.filter('playerNumFilter', function () {
    return function (fantasyLeagues, maxplayers) {
        var filtered = [];
        if (!fantasyLeagues || !maxplayers) {
            return fantasyLeagues;
        }
        if (!maxplayers || maxplayers.length == 0) {
            return fantasyLeagues;
        }
        
        for (var i = 0; i < fantasyLeagues.length; i++) {
            for (var j = 0; j < maxplayers.length; j++) {
                var value = fantasyLeagues[i].maxNumberPlayers;
                if (maxplayers[j] == '21+') {
                    if (value >= 21) {
                        filtered.push(fantasyLeagues[i]);
                    }
                }
                else if (value == maxplayers[j]) {
                    filtered.push(fantasyLeagues[i]);
                }
            }
        }
        return filtered;
    }
});

lobbyFilters.filter('stakeFilter', function () {

    return function (fantasyLeagues, minstake, maxstake) {
        var filtered = [];
        if (!fantasyLeagues) {
            return fantasyLeagues;
        }

        if (!minstake) {
            minstake = 0;
        }
        if (!maxstake) {
            maxstake = 9999999;
        }
        
        for (var i = 0; i < fantasyLeagues.length; i++) {
            var value = fantasyLeagues[i].entryFee;

            if (maxstake == 420) {
                if (value >= minstake)
                    filtered.push(fantasyLeagues[i]);
            }
            else {
                if (value >= minstake && value <= maxstake) {
                    filtered.push(fantasyLeagues[i]);
                }
            }
        }
        return filtered;

    }
});

lobbyFilters.filter('durationFilter', function () {
    return function (fantasyLeagues, durIds) {
        var filtered = [];
        if (!fantasyLeagues) {
            return fantasyLeagues;
        }
        if (!durIds || durIds.length == 0) {
            return fantasyLeagues;
        }

        for (var i = 0; i < fantasyLeagues.length; i++) {
            for (var j = 0; j < durIds.length; j++) {
                if (fantasyLeagues[i].fantasyLeagueDurationID == durIds[j]) {
                    filtered.push(fantasyLeagues[i]);
                }
            }
        }
        return filtered;
    }
});

lobbyFilters.filter('gameTypeFilter', function () {
    return function (fantasyLeagues, gameType) {
        var filtered = [];
        if (!fantasyLeagues) {
            return fantasyLeagues;
        }
        if (!gameType || gameType.length == 0)
            return fantasyLeagues;

        for (var i = 0; i < fantasyLeagues.length; i++) {
            for (var j = 0; j < gameType.length; j++) {
                //GUARANTEED
                if (gameType[j] == 'GUARANTEED') {
                    if (fantasyLeagues[i].guaranteed)
                        filtered.push(fantasyLeagues[i]);
                }

                //SIT N GO = NOT GUARANTEED
                else if (gameType[j] == 'SNG') {
                    if (!fantasyLeagues[i].guaranteed)
                        filtered.push(fantasyLeagues[i]);
                }

                //CUSTOM
                else if (gameType[j] == 'CUSTOM') {
                    if (fantasyLeagues[i].userIDCreatedFantasyLeague && !fantasyLeagues[i].isPrivate)
                        filtered.push(fantasyLeagues[i]);
                }
                
                //PRIVATE
                else if (gameType[j] == 'PRIVATE') {
                    if (fantasyLeagues[i].isPrivate)
                        filtered.push(fantasyLeagues[i]);
                }
            }
        }

        return filtered;
    }
});

lobbyFilters.filter('bettingStyleFilter', function () {
    return function (fantasyLeagues, bettingStyleIds) {
        var filtered = [];
        if (!fantasyLeagues) {
            return fantasyLeagues;
        }
        if (!bettingStyleIds || bettingStyleIds.length == 0) {
            return fantasyLeagues;
        }

        for (var i = 0; i < fantasyLeagues.length; i++) {
            for (var j = 0; j < bettingStyleIds.length; j++) {
                if (fantasyLeagues[i].fantasyLeagueBettingStyleID == bettingStyleIds[j]) {
                    filtered.push(fantasyLeagues[i]);
                }
            }
        }
        return filtered;
    }
});

lobbyFilters.filter('sportFilter', function () {
    return function (fantasyLeagues, sportIds) {
        var filtered = [];
        if (!fantasyLeagues) {
            return fantasyLeagues;
        }
        if (!sportIds || sportIds.length == 0) {
            return fantasyLeagues;
        }

        for (var i = 0; i < fantasyLeagues.length; i++) {
            for (var j = 0; j < sportIds.length; j++) {
                if (fantasyLeagues[i].leagueID == sportIds[j]) {
                    filtered.push(fantasyLeagues[i]);
                }
            }
        }
        return filtered;
    }
});

lobbyFilters.filter('multiEntryFilter', function () {
    return function (fantasyLeagues, multi) {
        var filtered = [];
        if (!fantasyLeagues || !multi) {
            return fantasyLeagues;
        }
        for (var i = 0; i < fantasyLeagues.length; i++) {

            if (fantasyLeagues[i].maxNumberEntriesPerUser > 1) {
                filtered.push(fantasyLeagues[i]);
            }
        }
        return filtered;
        
    }
});

lobbyFilters.filter('qualifierFilter', function () {
    return function (fantasyLeagues, qual) {
        var filtered = [];
        if (!fantasyLeagues || !qual) {
            return fantasyLeagues;
        }
        for (var i = 0; i < fantasyLeagues.length; i++) {

            if (fantasyLeagues[i].isQualifier) {
                filtered.push(fantasyLeagues[i]);
            }

        }
        return filtered;
        
    }
});

lobbyFilters.filter('satelliteFilter', function () {
    return function (fantasyLeagues, sat) {
        var filtered = [];
        if (!fantasyLeagues || !sat) {
            return fantasyLeagues;
        }
        for (var i = 0; i < fantasyLeagues.length; i++) {
            
            if (fantasyLeagues[i].isSatellite) {
                filtered.push(fantasyLeagues[i]);
            }
        }            
            return filtered;
        
    }
});
