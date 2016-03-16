var limitedToFreePlayModalController = angular.module("limitedToFreePlayModalController", []);

limitedToFreePlayModalController.controller('limitedToFreePlayModalController', ['$scope', 'clientFactory', '$uibModalInstance', 'message', function ($scope, clientFactory, $uibModalInstance, message) {
    //'use strict';
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.message = message;
}]);