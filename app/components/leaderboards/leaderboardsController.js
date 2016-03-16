var LeaderboardsController = angular.module("LeaderboardsController", []);

// TODO: Include controller for Universal Player Swap
// Trying to get the file to check in
LeaderboardsController.controller('LeaderboardsController', ['$scope', 'clientFactory', function ($scope, clientFactory) {
    //'use strict';
    $scope.loading = true;
    $scope.leaders = null;
    $scope.account = null;

    // Create the dropdown parameters
    $scope.availableLeagues = [{ id: '', league: "League" }, { id: '1', league: "NFL" }, { id: '2', league: "NBA" }, { id: '3', league: "MLB" }, { id: '4', league: "NHL" }];
    $scope.selectedLeague = $scope.availableLeagues[0];

    $scope.availableMonths = [{ id: '', month: 'Month' }, { id: '1', month: 'January' }, { id: '2', month: 'February' }, { id: '3', month: 'March' }, { id: '4', month: 'April' }, { id: '5', month: 'May' }, { id: '6', month: 'June' },
        { id: '7', month: 'July' }, { id: '8', month: 'August' }, { id: '9', month: 'September' }, { id: '10', month: 'October' }, { id: '11', month: 'November' }, { id: '12', month: 'December' }];
    var currMonth = new Date().getMonth();
    currMonth = currMonth + 1;
    $scope.resetMonth = $scope.availableMonths[currMonth];

    $scope.selectedMonth = $scope.availableMonths[currMonth];
    

    var availYears = [ { id: '', year: "Year" } ];
    var yr = new Date().getYear() + 1900;
    var maxYears = 3;
    for (var i = 0; i < maxYears; i++) {
        var myYr = (yr - i);
        availYears.push({ id: myYr.toString(), year: myYr.toString() });
    }

    $scope.availableYears = availYears;
    $scope.resetYear = $scope.availableYears[1];
    $scope.selectedYear = $scope.availableYears[1];
    

    $scope.player = "";


    clientFactory.tenants().GetLeaderboard(4, "ASC", "UserName", "", "", "", $scope.selectedMonth.id, $scope.selectedYear.id)
        .done(function (leaders) {
            leaders.sort(function (a, b) {
                return parseInt(a.rank) - parseInt(b.rank);
            });
            $scope.leaders = leaders;            
            $scope.loading = false;
            $scope.$apply();
        });

    //Tenants.prototype.GetLeaderboard = function (tenantID, sortDir, sortField, username, fields, excluded, month, year, leagueID, offset, limit) {
    $scope.GetFilteredLeaderboard = function (leagueId, monthId, year, player) {
        $scope.loading = true;
        // Build the filters required for the rest
        clientFactory.tenants().GetLeaderboard(4, "ASC", "UserName", player, "", "", monthId, year, leagueId, 0, 9999)
            .done(function (leaders) {
                leaders.sort(function (a, b) {
                    return parseInt(a.rank) - parseInt(b.rank);
                });
                $scope.leaders = leaders;
                $scope.loading = false;
                $scope.$apply();
            });
    }

    $scope.clear = function () {
        $scope.selectedMonth = $scope.resetMonth;
        $scope.selectedYear = $scope.resetYear;
        $scope.selectedLeague = $scope.availableLeagues[0];
        clientFactory.tenants().GetLeaderboard(4, "ASC", "UserName", "", "", "", $scope.selectedMonth.id, $scope.selectedYear.id)
            .done(function (leaders) {
                leaders.sort(function (a, b) {
                    return parseInt(a.rank) - parseInt(b.rank);
                });
                $scope.leaders = leaders;
                $scope.$apply();
            });

    }
}]);