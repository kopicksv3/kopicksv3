var scoringModule = angular.module('scoringModule');

scoringModule.directive('scoringOutput', ['calculateScoreValue', '$filter', function (calculateScoreValue, $filter) {
    var directive = {};
    directive.restrict = "AEC";
    directive.scope = {
        scoreAbbr: '@',
        scoreValue: '@'
    }

    directive.link = function($scope,element,attrs)
    {

    }
    directive.templateUrl = 'app/shared/scoring/directives/scoringOutput.html';
    directive.controller = function ($scope) {
        $scope.isNegative;
        $scope.isReady = false;
        $scope.pointsEarned = 0;
        /*
        * Returns the number of fantasy poitns earned by the given stat abbreviation and value
        */
        $scope.getScoringValue = function(statAbbr, statValue)
        {
            var val = calculateScoreValue.getScoreValue(statAbbr, statValue); 
            $scope.isNegative = val < 0;
            $scope.isReady = true;
            $scope.pointsEarned = $filter('number')(val, 2);

        }
        $scope.getVal = function()
        {
            return $scope.pointsEarned;
        }
        $scope.getScoringValue($scope.scoreAbbr, $scope.scoreValue);
    };
    return directive;
}]);