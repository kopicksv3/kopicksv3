var activeLeagues = angular.module('activeLeaguesService', []);
activeLeagues.service('ActiveLeaguesService', [function () {
    var _activePath = '#/myScores/scoreboard/';
    var _openPath = '#/draft/';
    this.setDestination = function (activeLeagues) {

        for (a in activeLeagues) {            
            var leaguePath = activeLeagues[a].fantasyLeagueID + "/" + activeLeagues[a].fantasyTeamID;
            if (isCurrent(activeLeagues[a]) && activeLeagues[a].yetToPlay == 0) {                
                activeLeagues[a].path = _activePath + leaguePath;
            }
            else {                
                activeLeagues[a].path = _openPath + leaguePath;
            }
        }
        activeLeagues.sort(function (a, b) {
            return a.startDate - b.startDate;
        });

        return activeLeagues;
    };

    function isCurrent(league) {
        // compare start date
        var now = Date.now();
        var start = Date.parse(league.startDate);

        if (now > start) {
            return true;
        }
        return false;
    }
}]);