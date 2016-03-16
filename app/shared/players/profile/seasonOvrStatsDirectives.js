var seasonOvrStatsDirectives = angular.module('seasonOvrStatsDirectives', []);

seasonOvrStatsDirectives.directive('seasonOvrStats', ['clientFactory', 'playerDataRetrieval', 'statLookup', function (clientFactory, playerDataRetrieval, statLookup) {
    //'use strict';
    return {
        restrict: 'EA',
        scope: {
            leagueId: '=',
            playerId: '=',
            sportId: '=',
            season: '=',
            posId: '=',
            statsType: '=',
            optionalTeamPositionId:'='  //Sometimes posid will be null, but there are two differnt ways to get the pos in this object
        }, 
        template: '<div ng-include src="getTemplate()"></div>',
        
        controller: ['$scope', '$rootScope', function ($scope, $rootScope) {
            $scope.lastPlayer = $scope.playerId;
            var getPositionID = function () {
                return angular.isDefined($scope.optionalTeamPositionId) ? $scope.optionalTeamPositionId : $scope.posId;
            }
            if ($scope.playerId) {                
                playerDataRetrieval.getbriefOverview($scope.playerId, getPositionID(), $scope.season, $scope.sportId)
                    .then(function (data) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].label == "Season") {
                                $scope.data = data[i];
                                break;
                            }
                        }
                    });
            }

            //listens for activePlayer change
            var myListener = $rootScope.$on('seasonOvrActivePlayer', function (event, player) {
                if (player.id && player.id != $scope.playerId) {
                    $scope.sport = player.sportId;
                    $scope.position = player.positionID;
                    $scope.posId = player.positionID;
                    $scope.playerId = player.id;
                    playerDataRetrieval.getbriefOverview(player.id, getPositionID(), player.season, player.sportId)
                    .then(function (data) {
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].label == "Season") {
                                $scope.data = data[i];
                                break;
                            }
                        }
                    });
                   
                 }
            });
            $scope.$on('$destroy', myListener); //prevents above from being rerun multiple times


            /*
             * Calls the statLookup service to get the object property mapped to the passed in alias.
             */
            $scope.getStat = function (object, alias) {
                return statLookup.getStat(object, alias, $scope.sportId);
            }


            $scope.getTemplateVars = function () {
                positionId = getPositionID();
                switch ($scope.sportId) {
                    case FlowerCityGaming.V1.Constants.Sports.FOOTBALL:
                        $scope.sport = 'football';
                        switch (positionId) {
                            case FlowerCityGaming.V1.Constants.Position.NFL_RB:
                                $scope.position = 'rb';
                                break;
                            case FlowerCityGaming.V1.Constants.Position.NFL_QB:
                                $scope.position = 'qb';
                                break;
                            case FlowerCityGaming.V1.Constants.Position.NFL_WR:
                                $scope.position = 'wr-te';
                                break;
                            case FlowerCityGaming.V1.Constants.Position.NFL_TE:
                                $scope.position = 'wr-te';
                                break;
                            case FlowerCityGaming.V1.Constants.Position.NFL_DST:
                                $scope.position = 'dst';
                                break;
                        }
                        break;

                    case FlowerCityGaming.V1.Constants.Sports.BASKETBALL:
                        $scope.sport = 'basketball';
                        $scope.position = 'default';
                        break;

                    case FlowerCityGaming.V1.Constants.Sports.HOCKEY:
                        $scope.sport = 'hockey';
                        $scope.position = 'default';
                        switch (positionId) {
                            case FlowerCityGaming.V1.Constants.Position.NHL_G:
                                $scope.position = 'g';
                                break;
                        }
                        break;

                    case FlowerCityGaming.V1.Constants.Sports.BASEBALL:
                        $scope.sport = 'baseball';
                        $scope.position = 'default';
                        switch (positionId) {
                            case FlowerCityGaming.V1.Constants.Position.MLB_SP:
                                $scope.position = 'sp'
                                break;
                        }
                }
            }

            $scope.getTemplate = function () {
                $scope.getTemplateVars();
                if ($scope.sport != undefined && $scope.position != undefined && $scope.data != null){                    
                    return 'app/shared/players/profile/templates/seasonOverview/' + $scope.sport + '-' + $scope.position + '.html';
                }
                else
                    return '';
                
            }
        }]


    }
}]);

