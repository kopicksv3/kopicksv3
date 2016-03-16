angular.module('UniversalPlayerSwap', ['ui.bootstrap']);

angular.module('UniversalPlayerSwap').controller('UniversalPlayerSwapController', ['$scope', '$uibModal', '$log', 'clientFactory', function ($scope, $uibModal, $log, clientFactory) {
    //'use strict';
    $scope.id = null;
    $scope.fl = null;

    $scope.openUPS = function (id) {
            clientFactory.fantasyLeagues().GetFantasyLeagueByID(id)
            .done(function (fll) {
                $scope.fl = fll;
                $uibModal.open({
                    templateUrl: 'ModalUniversalPlayerSwap.html',
                    controller: 'ModalInstanceController',
                    scope: $scope,
                    size: 'lg'
                });
            });
        };
    }]);


   
    

angular.module('UniversalPlayerSwap').controller('ModalInstanceController', ['$scope', '$uibModalInstance', 'clientFactory', function ($scope, $uibModalInstance, clientFactory) {
    //'use strict';
    $scope.ok = function () {
        $uibModalInstance.close();
    };

        $scope.cancel = function () {
            FlowerCityGaming.V1.logMessage('here');
        $uibModalInstance.dismiss('cancel');
    };

}]);