var pastLeaguesGridController = angular.module("pastLeaguesGridController", ['ui.bootstrap.datetimepicker']);

pastLeaguesGridController.controller('pastLeaguesGridController', ['$scope', 'clientFactory', function ($scope, clientFactory) {
    //'use strict';
    $scope.loading = true;
    $scope.pastLeagues = null;
    
    $scope.pastLeaguesCount = 0;
    $scope.pastLeaguesWinnings = 0;
    $scope.leagues = [];
    $scope.durations = [];
    $scope.gameTypes = [];
    $scope.betStyles = [];
    $scope.numPlayers = [];
    $scope.buyIns = [];

    $scope.leagues = [{ leagueID: '', leagueName: 'ALL', tabClass: 'active' },
    { leagueID: FlowerCityGaming.V1.Constants.Leagues['NFL'], leagueName: 'NFL' },
    { leagueID: FlowerCityGaming.V1.Constants.Leagues['MLB'], leagueName: 'MLB' },
    { leagueID: FlowerCityGaming.V1.Constants.Leagues['NBA'], leagueName: 'NBA' },
    { leagueID: FlowerCityGaming.V1.Constants.Leagues['NHL'], leagueName: 'NHL' }];

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


    clientFactory.accounts().GetCompletedFantasyLeaguesForAccount(clientFactory.getAccountId())
    .done(function (pastLeagues) {

        $scope.pastLeagues = pastLeagues;
        $scope.pastLeaguesCount = pastLeagues.length;

        var winnings = 0;
        for (var fantasyLeague in pastLeagues) {
            if (!isNaN(parseFloat(pastLeagues[fantasyLeague].moneyWinnings)) && isFinite(pastLeagues[fantasyLeague].moneyWinnings) && pastLeagues[fantasyLeague].moneyWinnings > 0) {
                winnings += pastLeagues[fantasyLeague].moneyWinnings;
            }
        }
        $scope.pastLeaguesWinnings = winnings;
        $scope.loading = false;
        $scope.$apply();

    });


    $scope.pastTab = function (incomingLeagueID) {
        $scope.pastLeaguesLeagueValFilter = incomingLeagueID;
    };

    $scope.clear = function () {
        $scope.pastLeaguesDurationValFilter = '';
        $scope.pastLeaguesGameTypeValFilter = '';
        $scope.pastLeaguesBetStyleValFilter = '';
        $scope.pastLeaguesNumPlayerValFilter = '';
        $scope.pastLeaguesBuyInValFilter = '';
        $scope.fromDateVal = '';
        $scope.toDateVal = '';
        $scope.pastLeaguesForm.$setPristine();
    };


}]);