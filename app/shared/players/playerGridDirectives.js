var playerGridDirectives = angular.module('playerGridDirectives', []);


playerGridDirectives.directive("playerRow", ['$filter', function ($filter) {
    //'use strict';
    var directive = {};

    
    directive.restrict = "EA";
    
    directive.scope = {
        league: '=',
        players: '=',
        sortType: '=',
        sortReverse: '=',
        activePosName: '=',
        avgSalary: '=',
        activePlayer: '='
     
        
    };
    
    directive.template = function (element, attrs) {
        return '<tr ng-include class="noselect" src="getTemplateUrl()" ng-repeat="p in players | playerByPositionFilter:activePosID | matchupFilter:matchupSelected | teamFilter:teamSelected | filter:searchPlayer | salaryFilter:avgSalary | orderBy:sortType" ng-click="playerClick(p)" ng-class="{\'activePlayer\': (activePlayer.positionID == nflDSTPosID ? (activePlayer.id == p.teamID) :(activePlayer.id == p.id)), \'playerSelected\' :  (p.inLineup) }"></tr>';
    };
    
    directive.controller = ['$scope', '$rootScope', '$filter', function ($scope, $rootScope, $filter) {

        var clickCount = 0;
        var timer = null;
        $scope.nflDSTPosID = FlowerCityGaming.V1.Constants.Position.NFL_DST;
        
        $scope.getBriefOverview = function (player) {
            $scope.$emit('playerDraftOverview', player);
        };
        

        $scope.playerClick = function (player) {
            clickCount++;
            if (clickCount == 2) {
                $rootScope.$broadcast('addPlayerToLineup', player);
                clickCount = 0;
                clearTimeout(timer);
            } else {
                $scope.$emit('playerDraftOverview', player);
                $rootScope.$emit('seasonOvrActivePlayer', player);
                timer = setTimeout(function () {
                    clickCount = 0;
                }, 300);
            }
        };
        $scope.$on('playerDraftOverview', function (event, player) {
            $scope.activePlayer = player;
        });
        $scope.$on('getActivePosIds', function (event, activePosIds) {
            $scope.activePosID = activePosIds;
        });
        $scope.$on('getTeamMatchup', function (event, args) {
            $scope.matchupSelected = args.matchup;
            $scope.teamSelected = args.team;
            $scope.searchPlayer = args.searchPlayer;
        });
        
        $scope.getTemplateUrl = function () {
            if ($scope.league) return '/app/shared/players/rows/' + FlowerCityGaming.V1.Constants.Leagues[$scope.league] + '/statsPlayer.html';
        };
    }]; 

    return directive;
}]);

playerGridDirectives.directive("statsHeader", ['$interpolate', '$rootScope', function ($interpolate, $rootScope) {
    var directive = {};
    var leagueID;
    directive.restrict = 'EA';

    directive.scope = {
        league: '@',
        activePosName: '='
    };
    
    /*
     * Use a template with an ng-include directive for dynamic templates
     */    
    directive.template = '<tr ng-include src="getTemplateUrl()"/>';

    directive.controller = function ($scope) {
        $scope.getTemplateUrl = function () {
            if($scope.league) return '/app/shared/players/rows/' + FlowerCityGaming.V1.Constants.Leagues[$scope.league] + '/statsHeader.html';
        }
        $scope.sortMe = function (sortType) {
            $scope.$emit('sortMe', sortType);
        };
    }

    
    
    return directive;
}]);
