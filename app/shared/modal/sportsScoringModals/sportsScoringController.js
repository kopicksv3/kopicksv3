
angular.module('sportsScoring', ['ui.bootstrap']);

angular.module('sportsScoring').controller('sportsScoringController', ['$scope','$uibModal','$log','clientFactory','$filter', function ($scope, $uibModal, $log, clientFactory, $filter) {
    //'use strict';
    $scope.id = null;
    $scope.fl = null;

    $scope.openSportsScoring = function (leagueID) {
        var templateTarget = '';
        var leagueStr = $filter('getLeagueStr')(leagueID).toLowerCase();
        FlowerCityGaming.V1.logMessage(leagueStr);
        switch (leagueStr) {
            case 'mlb':
                templateTarget += 'mlb';
                break;
            case 'nba':
                templateTarget += 'nba';
                break;
            case 'nfl':
                templateTarget += 'nfl';
                break;
            case 'nhl':
                templateTarget += 'nhl';
                break;
        }
        templateTarget += '.html';
            $uibModal.open({
                templateUrl: templateTarget,
                controller: 'ModalInstanceController',
                scope: $scope,
                size: 'lg'
            });
    };
}]);


angular.module('sportsScoring').controller('ModalInstanceController', ['$scope', '$uibModalInstance', 'clientFactory', function ($scope, $uibModalInstance, clientFactory) {
    //'use strict';
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);