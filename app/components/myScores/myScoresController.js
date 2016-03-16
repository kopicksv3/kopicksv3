var ScoresController = angular.module("scoresController", []);

// TODO: Include controller for Universal Player Swap
ScoresController.controller('scoresController', ['$scope', 'clientFactory','userLeaguesCache', function ($scope, clientFactory,userLeaguesCache) {
    //'use strict';
    $scope.leaguesWinning = 0;
    $scope.completeLeagueWinnings = 0;

    $scope.activeLeagues;
    $scope.completeLeagues;
    var tempDate = new Date();
    $scope.TwentyFourHoursAgo = new Date();
    $scope.TwentyFourHoursAgo.setHours(tempDate.getHours() - 24);
    $scope.testComplete;
    $scope.acctID = clientFactory.getAccountId();

    clientFactory.tenants().GetTenantById(4).dataOnly()
        .then(function (tenant) {
            $scope.tenant = tenant;
        });

    userLeaguesCache.getCompleteLeagues($scope.acctID, true, $scope.TwentyFourHoursAgo, true)
    .then(function (completeLeagues) {
        $scope.completeLeagues = completeLeagues;
        leagueCalculations();
    });
    userLeaguesCache.getActiveLeagues($scope.acctID, true, true)
    .then(function(active){
        //Watches our active leagues array and updates various fields
        $scope.activeLeagues = active;
        leagueCalculations();
    });

    var from = ($scope.TwentyFourHoursAgo.getMonth() + 1) + '/' + $scope.TwentyFourHoursAgo.getDate() + '/' + $scope.TwentyFourHoursAgo.getFullYear();
    var now = new Date();
    var fromDate = (now.getMonth() - 10) + '/' + now.getDate() + '/' + now.getFullYear();



    //Loops through the activeLeagues and completed laegues and performs calculations. Only if both variables are not null
    function leagueCalculations() {
        if (typeof $scope.activeLeagues != 'undefined') {
            var leaguesWinning = 0;
            var currentWinnings = 0;

            for (var x = 0; x < $scope.activeLeagues.length; x++) {

                if ($scope.activeLeagues[x].place == 1) {
                    leaguesWinning++;
                }

                currentWinnings += (typeof $scope.activeLeagues[x].moneyWinnings != 'undefined') ? $scope.activeLeagues[x].moneyWinnings : 0;
            }
            
            $scope.leaguesWinning = leaguesWinning;
            $scope.currentWinnings = currentWinnings;
        }
    }
}]);