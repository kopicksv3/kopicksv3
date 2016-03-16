var myLeaguesFilters = angular.module("myLeaguesFilters", []);

myLeaguesFilters.filter('fantasyLeagueButtonClassFilter', function () {
    //'use strict';
    return function (isValid, statusID) {
        if (isValid &&
            (statusID == FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.OPEN
            || statusID == FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.CLOSED
            || statusID == FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.DRAFTING)) {
            return 'valid-lineup';
        }
        else if (!isValid) {
            return 'invalid-lineup';
        }
        return '';
    };
});

myLeaguesFilters.filter('fantasyLeagueButtonTextFilter', function () {
    //'use strict';
    return function (statusID) {
        if (statusID == FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.OPEN
            || statusID == FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.CLOSED
            || statusID == FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.DRAFTING) {
            return 'Lineup';
        }
        return 'Scoreboard';
    };
});

myLeaguesFilters.filter('fantasyLeagueButtonLinkFilter', function () {
    //'use strict';
    return function (fantasyLeagueID, fantasyTeamID, statusID) {
        if (statusID == FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.OPEN
            || statusID == FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.CLOSED
            || statusID == FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.DRAFTING) {
            return '#/draft/' + fantasyLeagueID + '/' + fantasyTeamID;
        }
        return '#/myScores/scoreboard/' + fantasyLeagueID + '/' + fantasyTeamID;
    };
});

myLeaguesFilters.filter('myLeaguesDurationFilter', function () {
    //'use strict';
    return function (fantasyLeagues, durationID) {
        var filtered = [];
        if (!fantasyLeagues || !durationID) {
            return fantasyLeagues;
        }
        //ALL - returns all durationIDs
        if (durationID == '') {
            return fantasyLeagues;
        }

        //return the selected option
        else {
            for (var i = 0; i < fantasyLeagues.length; i++) {
                if (fantasyLeagues[i].durationID == durationID) {
                    filtered.push(fantasyLeagues[i]);
                }
            }
        }

        return filtered;
    }
});

myLeaguesFilters.filter('myLeaguesGameTypeFilter', function () {
    return function (fantasyLeagues, gameTypeValue) {
        var filtered = [];
        //return all if any data isn't defined
        if (typeof fantasyLeagues === 'undefined' || typeof gameTypeValue === 'undefined' || gameTypeValue === '' || gameTypeValue == null) {
            return fantasyLeagues;
        }
        //return the selected option
        else {
            for (fantasyLeague in fantasyLeagues) {
                if (fantasyLeagues[fantasyLeague].isGuaranteed == gameTypeValue) {
                    filtered.push(fantasyLeagues[fantasyLeague]);
                }
            }
        }
        return filtered;
    }
});

myLeaguesFilters.filter('myLeaguesBetStyleFilter', function () {
    return function (fantasyLeagues, leagueStyleID) {
        var filtered = [];
        //return all if any data isn't defined
        if (typeof fantasyLeagues === 'undefined' || typeof leagueStyleID === 'undefined' || leagueStyleID === '' || leagueStyleID == null) {
            return fantasyLeagues;
        }
        //return the selected option
        else {
            for (fantasyLeague in fantasyLeagues) {
                if (fantasyLeagues[fantasyLeague].fantasyLeagueBettingStyleID == leagueStyleID) {
                    filtered.push(fantasyLeagues[fantasyLeague]);
                }
            }
        }
        return filtered;
    }
});

myLeaguesFilters.filter('myLeaguesNumPlayerFilter', function () {
    return function (fantasyLeagues, numPlayerValue) {
        var filtered = [];
        //return all if any data isn't defined
        if (typeof fantasyLeagues === 'undefined' || typeof numPlayerValue === 'undefined' || numPlayerValue === '' || numPlayerValue == null) {
            return fantasyLeagues;
        }
        //return the selected option - if it's a number filter by that
        else if (!isNaN(parseFloat(numPlayerValue)) && isFinite(numPlayerValue)) {
            for (fantasyLeague in fantasyLeagues) {
                if (fantasyLeagues[fantasyLeague].numPlayers == numPlayerValue) {
                    filtered.push(fantasyLeagues[fantasyLeague]);
                }
            }
        }
        //the 'over' option - parse out the number and look for leagues greater
        else {
            numPlayerValue = numPlayerValue.match(/\d+/)[0];
            for (fantasyLeague in fantasyLeagues) {
                if (fantasyLeagues[fantasyLeague].numPlayers >= numPlayerValue) {
                    filtered.push(fantasyLeagues[fantasyLeague]);
                }
            }
        }
        return filtered;
    }
});
myLeaguesFilters.filter('myLeaguesBuyInFilter', function () {
    return function (fantasyLeagues, buyInValue) {
        var filtered = [];
        //return all if any data isn't defined
        if (typeof fantasyLeagues === 'undefined' || typeof buyInValue === 'undefined' || buyInValue === '' || buyInValue == null) {
            return fantasyLeagues;
        }
        //the 'over' option - parse out the number and look for leagues greater
        else {
            var minVal = buyInValue.indexOf('+') != -1 ? buyInValue.substring(0, buyInValue.indexOf('+')) : buyInValue.substring(0, buyInValue.indexOf('-'));
            var maxVal = buyInValue.indexOf('+') != -1 ? '' : buyInValue.substring(buyInValue.indexOf('-') + 1, buyInValue.length);
            for (fantasyLeague in fantasyLeagues) {
                if (!isNaN(parseFloat(minVal)) && isFinite(minVal) && !isNaN(parseFloat(maxVal)) && isFinite(maxVal)) {
                    if (fantasyLeagues[fantasyLeague].entryFee >= minVal && fantasyLeagues[fantasyLeague].entryFee <= maxVal) {
                        filtered.push(fantasyLeagues[fantasyLeague]);
                    }
                }
                else if (!isNaN(parseFloat(minVal)) && isFinite(minVal)) {
                    if (fantasyLeagues[fantasyLeague].entryFee >= minVal) {
                        filtered.push(fantasyLeagues[fantasyLeague]);
                    }
                }
                else if (!isNaN(parseFloat(maxVal)) && isFinite(maxVal)) {
                    if (fantasyLeagues[fantasyLeague].entryFee <= maxVal) {
                        filtered.push(fantasyLeagues[fantasyLeague]);
                    }
                }
            }
        }
        return filtered;
    }
});
myLeaguesFilters.filter('myLeaguesStatusFilter', function () {
    return function (fantasyLeagues, statusID) {
        var filtered = [];
        //return all if any data isn't defined
        if (typeof fantasyLeagues === 'undefined' || typeof statusID === 'undefined' || statusID === '' || statusID == null) {
            return fantasyLeagues;
        }
        else {
            for (fantasyLeague in fantasyLeagues) {
                if (fantasyLeagues[fantasyLeague].statusID == statusID) {
                    filtered.push(fantasyLeagues[fantasyLeague]);
                }
            }
        }
        return filtered;
    }
});

myLeaguesFilters.filter('myLeaguesLeagueFilter', function () {
    return function (fantasyLeagues, leagueID) {
        var filtered = [];
        //return all if any data isn't defined
        if (typeof fantasyLeagues === 'undefined' || typeof leagueID === 'undefined' || leagueID === '' || leagueID == null) {
            return fantasyLeagues;
        }
        else {
            for (fantasyLeague in fantasyLeagues) {
                if (fantasyLeagues[fantasyLeague].leagueID == leagueID) {
                    filtered.push(fantasyLeagues[fantasyLeague]);
                }
            }
        }
        return filtered;
    }
});

myLeaguesFilters.filter('myLeaguesDateFilter', function () {
    return function (fantasyLeagues, fromDate, toDate) {
        var filtered = [];
        var endDate;
        
        //return all if any data isn't defined
        if (typeof fantasyLeagues === 'undefined' || ((typeof fromDate === 'undefined' || fromDate == null || fromDate == '') && (typeof toDate === 'undefined' || toDate == null || toDate == ''))) {
            return fantasyLeagues;
        }

        if (typeof fromDate === 'undefined' || fromDate == null) {
            endDate = new Date(toDate);
            endDate.setDate(endDate.getDate() + 1);
            for (fantasyLeague in fantasyLeagues) {
                if (fantasyLeagues[fantasyLeague].startDate <= endDate) {
                    filtered.push(fantasyLeagues[fantasyLeague]);
                }
            }
        }
        else if (typeof toDate === 'undefined' || toDate == null) {
            for (fantasyLeague in fantasyLeagues) {
                if (fantasyLeagues[fantasyLeague].startDate >= fromDate) {
                    filtered.push(fantasyLeagues[fantasyLeague]);
                }
            }
        }
        else {
            endDate = new Date(toDate);
            endDate.setDate(endDate.getDate() + 1);
            for (fantasyLeague in fantasyLeagues) {
                if (fantasyLeagues[fantasyLeague].startDate >= fromDate && fantasyLeagues[fantasyLeague].startDate <= endDate) {
                    filtered.push(fantasyLeagues[fantasyLeague]);
                }
            }
        }
       

        return filtered;
    }
});

myLeaguesFilters.filter('myLeaguesNetWinningsFilter', function () {
    return function (fantasyLeagues) {
        var winnings = 0;
        if (fantasyLeagues) {
            for (fantasyLeague in fantasyLeagues) {
                winnings += fantasyLeagues[fantasyLeague].moneyWinnings;
            }
            return winnings;
        }
        
        return 0;
    }
});