var activeLeaguesController = angular.module('activeLeaguesController', ['activeLeaguesService']);

activeLeaguesController.controller('activeLeaguesController', ['$scope', '$location', 'clientFactory', 'ActiveLeaguesService', function ($scope, $location, clientFactory, ActiveLeaguesService) {
    //'use strict';
    $scope.loading = true;
    $scope.acctid = clientFactory.getAccountId();
    $scope.activeLeagues = null;
    $scope.leagues = [];
    $scope.durations = [];
    $scope.gameTypes = [];
    $scope.betStyles = [];
    $scope.numPlayers = [];
    $scope.buyIns = [];
    $scope.statuses = [];


    $scope.leagues = [{ leagueID: '', leagueName: 'ALL', tabClass: 'active' },    //set up as active drewww do differently??
        { leagueID: FlowerCityGaming.V1.Constants.Leagues['NFL'], leagueName: 'NFL' },
        { leagueID: FlowerCityGaming.V1.Constants.Leagues['MLB'], leagueName: 'MLB' },
        { leagueID: FlowerCityGaming.V1.Constants.Leagues['NBA'], leagueName: 'NBA' },
        { leagueID: FlowerCityGaming.V1.Constants.Leagues['NHL'], leagueName: 'NHL' }];

    //build durations array dynamically.  or not
    //if (activeLeagues[league].durationID) {
    //    var key = activeLeagues[league].durationID;
    //    var found = false;
    //    for (duration in $scope.durations) {
    //        if (duration.durationID == activeLeagues[league].durationID) {
    //            found = true;
    //            break;
    //        }
    //    }
    //    if (!found) {
    //        $scope.durations.push({ durationID: key, durationName: FlowerCityGaming.V1.Constants.FantasyLeagueDurationID[key] });
    //    }
    //}

    $scope.durations = [{ durationID: 1, durationName: 'Daily' },
                        { durationID: 3, durationName: 'Weekly' }];

    //build game types array
    $scope.gameTypes = [{ gameTypeValue: true, gameTypeName: 'Guaranteed' },
                        { gameTypeValue: false, gameTypeName: 'Sit-N-Go' }];

    //set up bet styles based on API
    for (var betStyleIdx in FlowerCityGaming.V1.Constants.FantasyLeagueBettingStyleID) {
        if (!isNaN(parseFloat(betStyleIdx)) && isFinite(betStyleIdx)) {
            $scope.betStyles.push({ betStyleID: betStyleIdx, betStyleName: FlowerCityGaming.V1.Constants.FantasyLeagueBettingStyleID[betStyleIdx] });
        }
    }

    $scope.numPlayers = [{ numPlayerValue: 2, numPlayerName: '2' },
                        { numPlayerValue: 3, numPlayerName: '3' },
                        { numPlayerValue: 6, numPlayerName: '6' },
                        { numPlayerValue: 10, numPlayerName: '10' },
                        { numPlayerValue: 20, numPlayerName: '20' },
                        { numPlayerValue: '21+', numPlayerName: 'Over 20' }];

    $scope.buyIns = [{ buyInValue: '0', buyInName: 'Free' },
                    { buyInValue: '1-10', buyInName: '$1-$10' },
                    { buyInValue: '11-20', buyInName: '$11-$20' },
                    { buyInValue: '21-30', buyInName: '$21-$30' },
                    { buyInValue: '31-40', buyInName: '$31-$40' },
                    { buyInValue: '41-50', buyInName: '$41-$50' },
                    { buyInValue: '51-60', buyInName: '$51-$60' },
                    { buyInValue: '61-70', buyInName: '$61-$70' },
                    { buyInValue: '71-80', buyInName: '$71-$80' },
                    { buyInValue: '81-90', buyInName: '$81-$90' },
                    { buyInValue: '91-100', buyInName: '$91-$100' },
                    { buyInValue: '101-200', buyInName: '$101-$200' },
                    { buyInValue: '201-300', buyInName: '$201-$300' },
                    { buyInValue: '301-400', buyInName: '$301-$400' },
                    { buyInValue: '401-500', buyInName: '$401-$500' },
                    { buyInValue: '501+', buyInName: '$501+' }];

    $scope.statuses = [{ statusID: FlowerCityGaming.V1.Constants.FantasyLeagueStatusID['OPEN'], statusName: 'Open' },
                        { statusID: FlowerCityGaming.V1.Constants.FantasyLeagueStatusID['CLOSED'], statusName: 'Closed' },
                        { statusID: FlowerCityGaming.V1.Constants.FantasyLeagueStatusID['RUNNING'], statusName: 'Running' }];

    if ($scope.acctid) {
        clientFactory.accounts().GetActiveFantasyLeaguesForAccount($scope.acctid)
        .done(function (activeLeagues) {
            activeLeagues = ActiveLeaguesService.setDestination(activeLeagues);            
            $scope.activeLeagues = activeLeagues;
            $scope.activeGames = activeLeagues.length;
            var winnings = 0;
            // TODO: Double check this loop to make sure that it works with valid data
            for (league in activeLeagues) {                
                var win = activeLeagues[league].moneyWinnings;                
                if ((win != null) && (typeof win != "undefined")) {
                    winnings += parseInt(win);
                }
            }

            $scope.curWin = winnings;
            //FlowerCityGaming.V1.logMessage($scope.activeLeagues);

            clientFactory.tenants().GetTenantById(4).dataOnly()
            .done(function (tenant) {
                $scope.tenant = tenant;
            });
            $scope.loading = false;
            $scope.$apply();

        })
        .fail(function () {
            FlowerCityGaming.V1.logMessage("This isn't working");
            $scope.loading = false;
        });
    }

    $scope.clear = function () {
        $scope.activeLeaguesDurationValFilter = '';
        $scope.activeLeaguesGameTypeValFilter = '';
        $scope.activeLeaguesBetStyleValFilter = '';
        $scope.activeLeaguesNumPlayerValFilter = '';
        $scope.activeLeaguesBuyInValFilter = '';
        $scope.activeLeaguesStatusValFilter = '';
        $scope.activeLeaguesForm.$setPristine();
    };

    $scope.activeTab = function (incomingLeagueID) {
        $scope.activeLeaguesLeagueValFilter = incomingLeagueID;
    };

    $scope.canLeave = function (incomingStatusID) {
        if (incomingStatusID == FlowerCityGaming.V1.Constants.FantasyLeagueStatusID['OPEN']) {
            return true;
        }
        return false;
    };

    //not using this because setting the path via button click isn't as nice as doing it via anchor
    //$scope.setButtonPath = function (fantasyLeagueID, fantasyTeamID, statusID) {

    //    if (statusID == FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.OPEN
    //            || statusID == FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.CLOSED
    //            || statusID == FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.DRAFTING) {
    //        $location.url( '/draft/' + fantasyLeagueID + '/' + fantasyTeamID);
    //        }

    //    $location.url('/scoreboard/' + fantasyLeagueID);
    //};
}]);

