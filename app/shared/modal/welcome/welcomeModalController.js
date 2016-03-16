var welcomeModalController = angular.module("welcomeModalController", []);

welcomeModalController.controller('welcomeModalController', ['$scope', 'clientFactory', '$uibModalInstance', 'accountModalService', function ($scope, clientFactory, $uibModalInstance, accountModalService) {
    //'use strict';
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.beginIDVerification = function () {
        $uibModalInstance.dismiss('cancel');
        accountModalService.runCashAction(function () { }); // trigger a "cash action" so they can do their verification
    };
}]);