var playerFilters = angular.module('playerFilters', []);

playerFilters.filter('playerByPositionFilter', function () {
    //'use strict';
    /*
     * @players: a group of players for a sport
     * @positions: the group of positions
     */
    var filters = [];
    var lastFiltered = {};
    return function (players, positions) {
        
        
        if (!players || !positions) {
            return players;
        }
        
        var filtered = [];

        // adds the player to the list if the player is in the arry of possitions passed in

        for (var i = 0; i < players.length; i++) {
            if (positions.indexOf(players[i].position) != -1) {
                filtered.push(players[i]);
            }
        }
     
        return filtered;
    }
});

playerFilters.filter('playerLineupDisplay', ['$filter', function ($filter) {
    return function (slot) {
        var name = "";        
        if (slot.personID != 0) {
            name = slot.firstName + " " + slot.lastName + " / " + slot.position + " / " + ($filter('currency')(slot.salary)).split('.')[0];
        }

        return name;
    }
}]);

playerFilters.filter('matchupFilter', function () {
    var filters = [];
    var lastFiltered = {};
    return function (players, matchups) {

        
        if (!players || !matchups) {
            return players;
        }

        
        var filtered = [];
        
        if (matchups) {
            var selected = matchups.split(",");


            for (var i = 0; i < players.length; i++) {
                for (var j = 0; j < selected.length; j++) {
                    if ((selected[j].toUpperCase()).indexOf((players[i].statistics.teamAlias).toUpperCase()) != -1) {
                        filtered.push(players[i]);
                    }
                }
            }
        }
        return filtered;
    }
});

playerFilters.filter('teamFilter', function () {
    var filters = [];
    var lastFiltered = {};
    return function (players, team) {


        if (!players || !team) {
            return players;
        }

        var filtered = [];

        for (var i = 0; i < players.length; i++) {
            
            if ((team.toUpperCase()).indexOf((players[i].statistics.teamName).toUpperCase()) != -1) {
                filtered.push(players[i]);
            }
            
        }
        
        return filtered;
    }
});


playerFilters.filter('statFilter', function () {
    return function (stat, fppg) {
        if (fppg && (stat == 0 || !stat)) {
            return '0.00';
        }
        else if (stat == 0 || !stat) {
            return '-';
        }
        else {
            return stat;
        }
    }
});

playerFilters.filter('salaryFilter', function () {
    var filters = [];
    var lastFiltered = {};
    return function (players, avgSal) {


        if (!players || !avgSal) {
            return players;
        }

        var filtered = [];

        for (var i = 0; i < players.length; i++) {
            
            if(avgSal >= players[i].salary) {
                filtered.push(players[i]);
            }
            
        }
        
        return filtered;
    }
});
