angular.module('UniversalPlayerSwap', ['ui.bootstrap']);

angular.module('UniversalPlayerSwap').controller('UniversalPlayerSwapController', ['$scope', '$uibModal', '$log', 'clientFactory', 'lineupService',  function ($scope, $uibModal, $log, clientFactory, lineupService) {
    //'use strict';
    $scope.id = null;
    $scope.fl = null;

    $scope.open = function (id) {

    clientFactory.fantasyLeagues().GetFantasyLeagueByID(id)
            .done(function (fll) {
                $scope.fl = fll;
                $uibModal.open({
                    templateUrl: 'ModalUniversalPlayerSwap.html',
                    controller: 'ModalInstanceController',

                    scope: $scope,
                    size: 'lg',
                    resolve: {
                        fl: function () {
                            FlowerCityGaming.V1.logMessage('fl', $scope.fl);
                            return $scope.fl;
                        }
                    }
                });
                $scope.$apply();
            });

    };

}]);