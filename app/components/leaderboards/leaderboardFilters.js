var leaderboardFilters = angular.module("LeaderboardFilters", []);

leaderboardFilters.filter('yearFilter', function () {
    //'use strict';
    return function (leaderboard, year) {
        var filtered = [];
        if (!leaderboard || !year) {
            return leaderboard;
        }
        for (var i = 0; i < leaderboard.length; i++) {
            if (leaderboard[i].leagueID == sportIds[j]) {
                filtered.push(leaderboard[i]);
            }
        }
        return filtered;
    }
});