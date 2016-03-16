var GameCenterController = angular.module("GameCenterController", []);


GameCenterController.controller('GameCenterController', ['$scope', 'clientFactory', '$timeout', '$location', 'userLeaguesCache', function ($scope, clientFactory, $timeout, $location, userLeaguesCache) {
    //'use strict';
    $scope.cashInPlay = 0;
    $scope.winnings = 0;
    $scope.activeLeagues = [];
    $scope.tenant = null;
    $scope.loading = true;

    clientFactory.tenants().GetTenantById(4).dataOnly()
        .then(function (tenant) {
            $scope.tenant = tenant;
        });

    //Performs various calculations using the active leagues
    function activeCalcs() {
        var cashInPlay = 0;
        var activeWinnings = 0;
        for (var x = 0; x < $scope.activeLeagues.length; x++) {
            cashInPlay += $scope.activeLeagues[x].entryFee;
            activeWinnings += ($scope.activeLeagues[x].moneyWinnings == null) ? 0 : $scope.activeLeagues[x].moneyWinnings;
        }

        $scope.winnings = activeWinnings;
        $scope.cashInPlay = cashInPlay;
    }


    userLeaguesCache.getActiveLeagues(clientFactory.getAccountId(), true)
    .then(function (activeLeagues) {
        $scope.activeLeagues = $scope.activeLeagues.concat(activeLeagues);
        activeCalcs();
        $scope.loading = false;
    });

}]);