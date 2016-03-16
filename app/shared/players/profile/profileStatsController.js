//Not sure this controller defintion should be in this file. It should probably be moved next to the view
angular.module('profileStatsHeaderDirectives').controller('PlayerProfileInstanceController', ['$scope', '$uibModalInstance', 'clientFactory', '$filter', '$window', '$timeout', 'appConstants', function ($scope, $uibModalInstance, clientFactory, $filter, $window, $timeout, appConstants) {
    //'use strict';
    $scope.BRIEF_OVERVIEW = 'BO';
    $scope.GAME_LOG = 'GL';
    $scope.SEASON_SPLITS = 'SS';
    $scope.CAREER = 'CA';

    $scope.statType = $scope.BRIEF_OVERVIEW; // Intially set stat type to BO
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.switchTab = function (targetHeader) {
        $timeout(function () {
            $scope.statType = targetHeader;
        });

    };



}]);

