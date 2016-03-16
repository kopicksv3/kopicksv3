var locationVerificationModalService = angular.module('locationVerificationModal', []);



locationVerificationModalService.service('locationVerificationModalService', ['clientFactory', '$uibModal', function (clientFactory, $uibModal) {
    //'use strict';

    this.displayLocationVerificationModal = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '/app/shared/modal/locationVerification/locationVerificationView.html',
            controller: 'locationVerificationController',
            //scope: $scope,
            size: 'lg',
            resolve: {

            }
        });
    };
}]);