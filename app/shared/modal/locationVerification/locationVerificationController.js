/// <reference path="C:\Users\Jake\Documents\Development\SFLDEV\SFL-Development-Mobile\Partner Websites\knockoutpicks.com\assets/scripts/api/FlowerCityGaming.js" />

var locationVerificationController = angular.module('locationVerificationController', []);

locationVerificationController.controller('locationVerificationController', ['$scope', 'clientFactory', '$uibModalInstance', function ($scope, clientFactory, $uibModalInstance) {
    //'use strict';

    var locationVerifyUrl = FlowerCityGaming.V1.IdentityServer.prepareLocationVerificationUrl(clientFactory.getAccountId());

    FlowerCityGaming.V1.logMessage("Setting location verify iframe to url: " + locationVerifyUrl);

    $scope.locationVerificationUrl = locationVerifyUrl;

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    FlowerCityGaming.V1.CrossDocumentMessaging.subscribe(FlowerCityGaming.V1.Constants.ClientConstants.CrossDocumentMessageType.LocationVerificationResult, function (message) {
        FlowerCityGaming.V1.logMessage("Got location verify result (locationVerificationController)", message);
        FlowerCityGaming.V1.logMessage(FlowerCityGaming.V1.Constants.ClientConstants.LocationVerificationResult[message.message]);

        $uibModalInstance.dismiss('cancel');
    });
}]);