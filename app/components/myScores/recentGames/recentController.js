var recentController = angular.module("recentController", []);



recentController.controller('recentController', ['$scope', 'clientFactory','userLeaguesCache','$interval','$timeout', function ($scope, clientFactory,userLeaguesCache,$interval,$timeout) {
    //'use strict';
    $scope.loading = true;
    var tempDate = new Date();
    $scope.TwentyFourHoursAgo = new Date();
    $scope.TwentyFourHoursAgo.setHours(tempDate.getHours() - 24);

    $scope.focusedPreviewTeamID = 0;

    $scope.activeNotLoaded = true;
    $scope.compeltedNotLoaded = true;
    $scope.activeLeagues = [];
    $scope.completeLeagues = [];
    $scope.scoreBoardLoaded = false;
    $scope.tenant = null;

    clientFactory.tenants().GetTenantById(4).dataOnly()
        .then(function (tenant) {
            $scope.tenant = tenant;
        });
    //$scope.focusedPreviewTeamData = {};

    $scope.completedLeaguesTemp;

    userLeaguesCache.getActiveLeagues($scope.acctID, true, true)
     .then(function (activeLeagues) {
         //Temp code that can be removed in prod
         for (var x = 0; x < activeLeagues.length; x++) {
             //activeLeagues[x].EndDate = $scope.TwentyFourHoursAgo + 10;
         }
         $scope.activeNotLoaded = false;
         $scope.activeLeagues = activeLeagues;

     });

    userLeaguesCache.getCompleteLeagues($scope.acctID, true, $scope.TwentyFourHoursAgo)
        .then(function (completeLeagues) {
            var leagueIDs = [];
            //Temp code that can be removed in prod
            for (var x = 0; x < completeLeagues.length; x++) {
                //completeLeagues[x].endDate = new Date();
                leagueIDs.push(completeLeagues[x].fantasyLeagueID);
            }
            $scope.compeltedNotLoaded = false;
            $scope.completeLeagues = completeLeagues
            $scope.GetExtraData(leagueIDs);
            
        });

 
    
    

    $scope.GetExtraData = function (leagueIDs)
    {
        if (leagueIDs.length != 0) {
        clientFactory.fantasyLeagues().GetFantasyLeagueByIdArray(leagueIDs)   //leagueIDs.join())
            .done(function (data) {
                for(var x = 0; x < data.length; x++)
                {
                    $scope.completeLeagues[x].LeagueData = data[x];
                }
            })
        }
        $timeout(function () {
            $scope.loading = false;
        })

    }

    //User clicked a recent game and wants to preview the scoreboard for the game
    $scope.switchScorePreview = function (leagueData) {
        if (leagueData.fantasyTeamID == $scope.focusedPreviewTeamID) {
            $scope.focusedPreviewTeamID = 0;
        }
        else {
            /*
             * Give the scoreboard some time to load before displaying.
             * (It will only display when previewTeamID !== 0)
             * 
             * Its not a huge deal if it does not load in time, it just looks funny
             */
            var waitTime = $scope.scoreBoardLoaded ? 0 : 1000;
            $interval(function () {
                $scope.focusedPreviewTeamID = leagueData.fantasyTeamID
                $scope.scoreBoardLoaded = true;
            }, waitTime, 1);
            
            $scope.focusedPreviewTeamData = leagueData
        }
    }
}]);