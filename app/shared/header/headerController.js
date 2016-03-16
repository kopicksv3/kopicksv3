/// <reference path="../../../assets/scripts/api/FlowerCityGaming.js" />

var headerController = angular.module('headerController', ['accountModals']);

headerController.controller('headerController', ['$scope', 'clientFactory', '$route', 'accountModalService', '$uibModalStack', "$anchorScroll", "$location",
    function ($scope, clientFactory, $route, accountModalService, $uibModalStack, $anchorScroll, $location) {
    //'use strict';
    $scope.cashBalance = "$-.--";
    $scope.isLoggedIn = (!FlowerCityGaming.V1.IdentityServer.isTokenExpired() && clientFactory.getAccountId());
    $scope.pointsBalance = "-";
    $scope.userName = $scope.isLoggedIn ? clientFactory.getUserName() : "";
    $scope.currentRoute = $route.current.$$route.originalPath.toLowerCase();

    //
    // Model modals / operations

    $scope.displayLoginModal = function () {
        accountModalService.displayLoginModal();
    };


    // If you're logged in, then
    $scope.playNowButtonClick = ($scope.isLoggedIn ? (function () {
        if ($location.path() == "/lobby") { // If you're on the lobby, scroll down
            $anchorScroll("LobbyGridPanel");
        } else {
            $location.path("/lobby"); // Not on the lobby, so go there
        }
    }) : ($scope.displayLoginModal)); // You aren't logged in, so display the login
    
    $scope.displayRegisterModal = function () {
        accountModalService.displayRegisterModal();
    };

    $scope.logout = function () {
        FlowerCityGaming.V1.IdentityServer.performLogout(
            FlowerCityGaming.V1.IdentityServer.getIdServerResponse() ? FlowerCityGaming.V1.IdentityServer.getIdServerResponse().IdToken : "",
            FlowerCityGaming.V1.IdentityServer.getIdServerResponse() ? FlowerCityGaming.V1.IdentityServer.getIdServerResponse().AccessToken : "",
            clientFactory.getTenantId())
            .done(function () {
                window.location.assign("#/lobby");
                window.location.reload(); // Required as above location is only changing via hash
            })
            .fail(function () {
                FlowerCityGaming.V1.logError("Log out failure");
            });
    };

    //
    // Items needed from API

    if ($scope.isLoggedIn) {
        clientFactory.getCachedAccountByID(clientFactory.getAccountId())
        .done(function (accountDetails, tenantDetails) {
            $scope.cashBalance = "$" + accountDetails.userBalance.toFixed(2);
            $scope.pointsBalance = accountDetails.internalPoints.toFixed(0);
            $scope.profilePhotoUrl = accountDetails.profilePhotoUrl;
        });
    }

    // If we need to send the message we literally just sent
    if ($.cookie("login_after_email_verify_complete") == "true"
        && (!FlowerCityGaming.V1.IdentityServer.isTokenExpired() && (clientFactory.getAccountId()) != null)) {
        $.cookie("login_after_email_verify_complete", false);
        FlowerCityGaming.V1.IdentityServer.processAuthRefreshEmailVerifyCompleteCallback();
    }

    FlowerCityGaming.V1.CrossDocumentMessaging.subscribe(FlowerCityGaming.V1.Constants.ClientConstants.CrossDocumentMessageType.LoginFormRequested, function (message) {
        window.location.hash = "/landing";
        $scope.displayLoginModal();
    });

    FlowerCityGaming.V1.CrossDocumentMessaging.subscribe(FlowerCityGaming.V1.Constants.ClientConstants.CrossDocumentMessageType.RegisterRequested, function (message) {
        window.location.hash = "/landing";
        $uibModalStack.dismissAll();
        $scope.displayRegisterModal();
    });

    FlowerCityGaming.V1.CrossDocumentMessaging.subscribe(FlowerCityGaming.V1.Constants.ClientConstants.CrossDocumentMessageType.SignInAfterEmailVerificationComplete, function (message) {
        FlowerCityGaming.V1.logMessage("Got sign in complete first time message", message);
        $uibModalStack.dismissAll();
        accountModalService.displayWelcomeModal();
    });

    FlowerCityGaming.V1.CrossDocumentMessaging.subscribe(FlowerCityGaming.V1.Constants.ClientConstants.CrossDocumentMessageType.LocationVerificationResult, function (message) {
        FlowerCityGaming.V1.logMessage("Got location verify result", message);
        FlowerCityGaming.V1.logMessage(FlowerCityGaming.V1.Constants.ClientConstants.LocationVerificationResult[message.message]);

        // first, depending on the status of the result, subscribe to the claims refresh event
        if (message.message == FlowerCityGaming.V1.Constants.ClientConstants.LocationVerificationResult.ALLOWED) {
            accountModalService.displayWelcomeVerifiedModal();
        } else if (message.message == FlowerCityGaming.V1.Constants.ClientConstants.LocationVerificationResult.IDOLOGY_NOT_VERIFIED) {
            FlowerCityGaming.V1.CrossDocumentMessaging.subscribe(FlowerCityGaming.V1.Constants.ClientConstants.CrossDocumentMessageType.AuthenticationResult, function (message) {
                // include "/" before the hash, so that it will clear out the query string so the user isn't relentlessly attacked with dialogs
                window.location.assign("/#/verificationPending");
                window.location.reload(); // Required as above location is only changing via hash
            });
        } else if (message.message == FlowerCityGaming.V1.Constants.ClientConstants.LocationVerificationResult.IDOLOGY_NOT_VERIFIED_UNDER_REVIEW) {
            FlowerCityGaming.V1.CrossDocumentMessaging.subscribe(FlowerCityGaming.V1.Constants.ClientConstants.CrossDocumentMessageType.AuthenticationResult, function (message) {
                // include "/" before the hash, so that it will clear out the query string so the user isn't relentlessly attacked with dialogs
                window.location.assign("/#/verificationPending");
                window.location.reload(); // Required as above location is only changing via hash
            });
        } else if (message.message == FlowerCityGaming.V1.Constants.ClientConstants.LocationVerificationResult.LOCATION_NOT_ALLOWED) {
            FlowerCityGaming.V1.CrossDocumentMessaging.subscribe(FlowerCityGaming.V1.Constants.ClientConstants.CrossDocumentMessageType.AuthenticationResult, function (message) {
                // include "/" before the hash, so that it will clear out the query string so the user isn't relentlessly attacked with dialogs
                window.location.assign("/#/invalidLocationProvided");
                window.location.reload(); // Required as above location is only changing via hash
            });
        } else if (message.message == FlowerCityGaming.V1.Constants.ClientConstants.LocationVerificationResult.LOCATION_AGE_NOT_ALLOWED) {
            FlowerCityGaming.V1.CrossDocumentMessaging.subscribe(FlowerCityGaming.V1.Constants.ClientConstants.CrossDocumentMessageType.AuthenticationResult, function (message) {
                // include "/" before the hash, so that it will clear out the query string so the user isn't relentlessly attacked with dialogs
                window.location.assign("/#/invalidAgeProvided");
                window.location.reload(); // Required as above location is only changing via hash
            });
        } else if (message.message == FlowerCityGaming.V1.Constants.ClientConstants.LocationVerificationResult.DETECTED_LOCATION_INVALID) {
            FlowerCityGaming.V1.CrossDocumentMessaging.subscribe(FlowerCityGaming.V1.Constants.ClientConstants.CrossDocumentMessageType.AuthenticationResult, function (message) {
                // include "/" before the hash, so that it will clear out the query string so the user isn't relentlessly attacked with dialogs
                window.location.assign("/#/invalidLocation");
                window.location.reload(); // Required as above location is only changing via hash
            });
        } else if (message.message == FlowerCityGaming.V1.Constants.ClientConstants.LocationVerificationResult.INTERNAL_ERROR) {
            FlowerCityGaming.V1.CrossDocumentMessaging.subscribe(FlowerCityGaming.V1.Constants.ClientConstants.CrossDocumentMessageType.AuthenticationResult, function (message) {
                // include "/" before the hash, so that it will clear out the query string so the user isn't relentlessly attacked with dialogs
                window.location.assign("/#/registrationError");
                window.location.reload(); // Required as above location is only changing via hash
            });
        }

        // then, force access token refresh so we get new verification statuses in the claims
        // this will trigger off the above subscription
        FlowerCityGaming.V1.IdentityServer.refreshAccessToken();
    });
}]);