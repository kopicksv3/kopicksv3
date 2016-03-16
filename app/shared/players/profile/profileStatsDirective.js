var profileStatsHeaderDirectives = angular.module('profileStatsHeaderDirectives');

/*
 * This directives job is to fetch player profile stats.
 * 
 * The user of this directive is responsible for chaning the directives paramters in order to fetch valid data.
 * 
 * After the INITIAL load of the directive it will watch for changes in the statsType paramter and make any required updates.
 * 
 * The directive will cause a series of 
 * <tr>
 * <td>StatValue1</td>
 * <td>StatValue2</td>
 * <tr>
 * <tr>
 *   <td>StatValue1</td>
 *   <td>StatValue2</td>
 * <tr>
 * 
 * This directive is highly coupled with the profileStatsHeaderDirective
 * 
 */
profileStatsHeaderDirectives.directive('profileStats', ['clientFactory', 'playerDataRetrieval', '$timeout', 'statLookup', '$templateCache', function (clientFactory, playerDataRetrieval, $timeout, statLookup, $templateCache) {
    //'use strict';
    return {
        restrict: 'A',
        template: '<div ng-repeat="y in data" ng-include="getTemplate()" include-replace></div>',
        scope: {
            leagueId: '=',
            playerId: '=',
            sportId: '=',
            season: '=',
            posId: '=',
            flidId: '=',
            optionalTeamPosId: '=',
            statsType: '@'
        },

        controller: function ($scope, $element, $attrs) {
            var getPositionID = function () {
                return angular.isDefined($scope.optionalTeamPosId) ? $scope.optionalTeamPosId : $scope.posId;
            }
            /*
             * Constnats that represent the tabs the user can possibly choose
             */
            $scope.BRIEF_OVERVIEW = 'BO';
            $scope.GAME_LOG = 'GL';
            $scope.SEASON_SPLITS = 'SS';
            $scope.CAREER = 'CA';

            /*
             * Caches the results from the tabs
             */
            $scope.tabData = {};
            $scope.templateChoices = {};
            playerDataRetrieval.getbriefOverview($scope.playerId, getPositionID(), $scope.season, $scope.sportId)
            .then(function (data) {
                $scope.tabData[$scope.BRIEF_OVERVIEW] = data;
                $scope.data = data;
            });


            playerDataRetrieval.getGameLog($scope.playerId, getPositionID(), $scope.season)
            .then(function (data) {
                $scope.tabData[$scope.GAME_LOG] = data;
            });


            playerDataRetrieval.getSeasonSplits($scope.playerId, getPositionID(), $scope.season)
            .then(function (data) {
                $scope.tabData[$scope.SEASON_SPLITS] = data;
            });


            playerDataRetrieval.getCareer($scope.playerId, getPositionID(), $scope.season)
            .then(function (data) {
                $scope.tabData[$scope.CAREER] = data;
            });


            /*
             * When the user changes the tab, make sure that we remove all old data then change the data.
             * Or else the UI will appear strange (rows popping in and popping out randomly)
             */
            $attrs.$observe('statsType', function (val) {
                //$element.find('tr').remove();
                changePlayerData();
            });

            /*
             * Calls the statLookup service to get the given property directly off the given stat object
             */
            $scope.getProp = function (object, prop) {
                return statLookup.getObjectProp(object, prop);
            };

            /*
             * Calls the statLookup service to get the object property mapped to the passed in alias.
             */
            $scope.getStat = function (object, alias) {
                return statLookup.getStat(object, alias, $scope.sportId);
            };

            /*
             * Depending on the current sport, playerPosition, and tab selected determine which html template to display
             */
            $scope.getTemplate = function () {
                return 'app/shared/players/profile/templates/' + $scope.tab + '/' + $scope.sport + '-' + $scope.position + '.html';
            };


            /*
             * Each different tab (BriefOverview,GameLog,SeasonSplits,Career) requires a different api CALL
             * This method will take in the tab type and will make the $scope.data object equal to the result.
             * 
             */
            var getPlayerData = function (dataType) {
                $scope.data = $scope.tabData[dataType.toUpperCase()];
            };

            var changePlayerData = function () {
                getPlayerData($scope.statsType);


                //======================= Normalize the sport passed into the directive===========================//
                switch ($scope.sportId) {
                    case FlowerCityGaming.V1.Constants.Sports.FOOTBALL:
                        $scope.sport = 'football';
                        break;
                    case FlowerCityGaming.V1.Constants.Sports.BASKETBALL:
                        $scope.sport = 'basketball';
                        break;
                    case FlowerCityGaming.V1.Constants.Sports.HOCKEY:
                        $scope.sport = 'hockey';
                        break;
                    case FlowerCityGaming.V1.Constants.Sports.BASEBALL:
                        $scope.sport = 'mlb';
                        break;
                }
                //======================= Get the currently specefied Tab =================//
                switch ($scope.statsType) {
                    case $scope.BRIEF_OVERVIEW:
                        $scope.tab = 'BriefOverview';
                        break;
                    case $scope.GAME_LOG:
                        $scope.tab = 'GameLog';
                        break;
                    case $scope.SEASON_SPLITS:
                        $scope.tab = 'SeasonSplits';
                        break;
                    case $scope.CAREER:
                        $scope.tab = 'Career';
                        break;
                }
                //======================= Normalize the position Passed to the directive=================//
                switch (getPositionID()) {
                    /*FootBall*/
                    case FlowerCityGaming.V1.Constants.Position.NBA_G:
                    case FlowerCityGaming.V1.Constants.Position.NBA_G:
                    case FlowerCityGaming.V1.Constants.Position.NBA_U:
                    case FlowerCityGaming.V1.Constants.Position.NBA_F:
                    case FlowerCityGaming.V1.Constants.Position.NBA_B:
                    case FlowerCityGaming.V1.Constants.Position.NBA_C:
                        $scope.position = 'default';
                        break;
                    case FlowerCityGaming.V1.Constants.Position.NFL_RB:
                        $scope.position = 'rb';
                        break;
                    case FlowerCityGaming.V1.Constants.Position.NFL_TE:
                    case FlowerCityGaming.V1.Constants.Position.NFL_WR:
                        $scope.position = 'te';
                        break;
                    case FlowerCityGaming.V1.Constants.Position.NFL_QB:
                        $scope.position = 'qb';
                        break;
                        /*NHL*/
                    case FlowerCityGaming.V1.Constants.Position.NHL_C:
                    case FlowerCityGaming.V1.Constants.Position.NHL_RW:
                    case FlowerCityGaming.V1.Constants.Position.NHL_D:
                    case FlowerCityGaming.V1.Constants.Position.NHL_LW:
                    case FlowerCityGaming.V1.Constants.Position.NHL_W:
                    case FlowerCityGaming.V1.Constants.Position.NHL_FLEX:
                    case FlowerCityGaming.V1.Constants.Position.NHL_F:
                        $scope.position = 'default';
                        break;
                    case FlowerCityGaming.V1.Constants.Position.NHL_G:
                        $scope.position = 'g';
                        break;

                        /*MLB*/
                    case FlowerCityGaming.V1.Constants.Position.MLB_SP:
                    case FlowerCityGaming.V1.Constants.Position.MLB_P:
                        $scope.position = 'p';
                        break;
                    case FlowerCityGaming.V1.Constants.Position.MLB_RP:
                    case FlowerCityGaming.V1.Constants.Position.MLB_SP:
                    case FlowerCityGaming.V1.Constants.Position.MLB_SS:
                    case FlowerCityGaming.V1.Constants.Position.MLB_THREEB:
                    case FlowerCityGaming.V1.Constants.Position.MLB_TWOB:
                    case FlowerCityGaming.V1.Constants.Position.MLB_U:
                    case FlowerCityGaming.V1.Constants.Position.MLB_BN:
                    case FlowerCityGaming.V1.Constants.Position.MLB_C:
                    case FlowerCityGaming.V1.Constants.Position.MLB_IF:
                    case FlowerCityGaming.V1.Constants.Position.MLB_OF:
                    case FlowerCityGaming.V1.Constants.Position.MLB_ONEB:
                        $scope.position = 'default';
                        break;
                }
            };

            //Call this initially to cause initial data to load.
            changePlayerData();
        }
    };
}]);


/*
 * This directive is used to remove the parent element from html EX:
 * 
 * <div includeReplace>
 *   <div id ='2'></div>
 * </div>
 * 
 * Would result in <div id='2'></div> being rendered.
 */
profileStatsHeaderDirectives.directive('includeReplace', function () {
    return {
        require: 'ngInclude',
        restrict: 'A', /* optional */
        link: function (scope, el, attrs) {
            el.replaceWith(el.children());
        }
    };
});