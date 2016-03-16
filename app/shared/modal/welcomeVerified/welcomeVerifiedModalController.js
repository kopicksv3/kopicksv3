var welcomeVerifiedModalController = angular.module("welcomeVerifiedModalController", []);

welcomeVerifiedModalController.controller('welcomeVerifiedModalController', ['$scope', 'clientFactory', '$uibModalInstance', 'accountModalService', function ($scope, clientFactory, $uibModalInstance, accountModalService) {
    //'use strict';
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.continue = function () {
        $uibModalInstance.dismiss('cancel');
        window.location.assign("#/lobby");
        window.location.reload(); // Required as above location is only changing via hash
    };
}]);