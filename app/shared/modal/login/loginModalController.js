/// <reference path="C:\Users\Jake\Documents\Development\SFLDEV\SFL-Development-Mobile\Partner Websites\knockoutpicks.com\assets/scripts/api/FlowerCityGaming.js" />

var loginModalController = angular.module('loginModalController', []);

loginModalController.controller('loginModalController', ['$scope', 'clientFactory', '$uibModalInstance', function ($scope, clientFactory, $uibModalInstance) {
    //'use strict';
    FlowerCityGaming.V1.CrossDocumentMessaging.subscribe(FlowerCityGaming.V1.Constants.ClientConstants.CrossDocumentMessageType.AuthenticationResult, function (message) {
        if (message.message.result == FlowerCityGaming.V1.Constants.ClientConstants.AuthenticationResult.TokenRefreshSuccess) {
            $.cookie("idsvrtoken", JSON.stringify(message.message.response));
            window.location.assign("#/lobby");
            window.location.reload(); // Required as above location is only changing via hash
        } else if (message.message.result == FlowerCityGaming.V1.Constants.ClientConstants.AuthenticationResult.SUCCESS_BUT_DETECTED_LOCATION_INVALID) {
            // on detected location invalid, do the same thing as success login, but instead redirect to the invalid location page
            $.cookie("idsvrtoken", JSON.stringify(message.message.response));
            window.location.assign("#/invalidLocation");
            window.location.reload(); // Required as above location is only changing via hash
        } else if (message.message.result == FlowerCityGaming.V1.Constants.ClientConstants.AuthenticationResult.ACCOUNT_LOCKED) {
            window.location.assign("?Username=" + message.message.Username + "#/accountLocked");
            //removed on purpose so it actually goes there. window.location.reload(); // Required as above location is only changing via hash
        } else if (message.message.result == FlowerCityGaming.V1.Constants.ClientConstants.AuthenticationResult.USER_BANNED) {
            window.location.assign("#/banned");
            window.location.reload(); // Required as above location is only changing via hash
        } else if (message.message.result == FlowerCityGaming.V1.Constants.ClientConstants.AuthenticationResult.EMAIL_NOT_VERIFIED) {
            window.location.assign("#/emailVerify");
            window.location.reload(); // Required as above location is only changing via hash
        }
    });

    $scope.idServerEndpoint = FlowerCityGaming.V1.IdentityServer.prepareAccessTokenRefreshUrl();

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);