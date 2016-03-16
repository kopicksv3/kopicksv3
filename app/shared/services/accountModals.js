var accountModals = angular.module('accountModals', []);

accountModals.service('accountModalService', ['clientFactory', 'locationVerificationModalService', '$uibModal', function (clientFactory, locationVerificationModalService, $uibModal) {
    //'use strict';
    this.displayLoginModal = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '/app/shared/modal/login/loginModalView.html',
            controller: 'loginModalController',
            scope: null,
            size: 'sm',
            resolve: { }
        });
    };

    this.displayWelcomeModal = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '/app/shared/modal/welcome/welcomeModalView.html',
            controller: 'welcomeModalController',
            scope: null,
            size: 'sm',
            resolve: { }
        });
    };

    this.displayWelcomeVerifiedModal = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '/app/shared/modal/welcomeVerified/welcomeVerifiedModalView.html',
            controller: 'welcomeVerifiedModalController',
            scope: null,
            size: 'sm',
            resolve: {}
        });
    };

    this.displayRegisterModal = function () {
        var modalInstance = $uibModal.open({
            templateUrl: "/app/shared/modal/register/registerView.html",
            controller: "registerController",
            scope: null,
            size: 'lg',
            resolve: {}
        });
    };

    /*
     * @param callbackIfCashAllowed     Run this function if cash actions are allowed
     * @param silent                    If true, do not display any modals
     */
    this.runCashAction = function (callbackIfCashAllowed, silent) {
        var isLoggedIn = (!FlowerCityGaming.V1.IdentityServer.isTokenExpired() && (clientFactory.getAccountId() != null));
        var verificationStatus = null;
        var statusID = null;
        
        if (isLoggedIn) {
            // get the string constant of the verification status
            verificationStatus = clientFactory.getVerificationStatus();

            // get the number constant of the verification status
            statusID = FlowerCityGaming.V1.Constants.UserLocationVerificationStatus[verificationStatus];
        }


        // compare the status to the dot notation constant for readability
        // calling UserLocationVerificationStatus.VerifiedAllowed gets you an integer

        // If you're logged in and you're verified allowed, do the cash action
        if (isLoggedIn && statusID == FlowerCityGaming.V1.Constants.UserLocationVerificationStatus.VerifiedAllowed) {

            // If we have a callback function let's fire it off
            if (callbackIfCashAllowed != null) {
                callbackIfCashAllowed();
            }

            // if you're logged in but you haven't been verified yet, start the verification process
            // this status also includes if you're allowed to verify at all, so if you can't verify you'll have a different status
        } else if (isLoggedIn && statusID == FlowerCityGaming.V1.Constants.UserLocationVerificationStatus.NotVerified) {
            if (!silent) {
                locationVerificationModalService.displayLocationVerificationModal(); // pop open the verification dialog
            }
        } else {

            // Bypass if no UI required
            if (silent) {
                return;
            }

            // Default message
            var message = "You have been restricted from playing real money games. Please contact support for more information.";

            // these are all statuses if you're logged in
            if (isLoggedIn) {

                // Go and get the user's account info so we know what to say
                clientFactory.getCachedAccountByID(clientFactory.getAccountId(), false).done(function (accountInfo) {
                    // user is just standard "not allowed to play"
                    if (statusID == FlowerCityGaming.V1.Constants.UserLocationVerificationStatus.LimitedToFreeToPlay
                        || statusID == FlowerCityGaming.V1.Constants.UserLocationVerificationStatus.BlockedFromPlay) {


                        // try to get the user's age
                        var age = null;

                        if (accountInfo.dob != null) {
                            // taken from http://stackoverflow.com/questions/4060004/calculate-age-in-javascript
                            var _calculateAge = function (birthday) { // birthday is a date
                                var ageDifMs = Date.now() - birthday.getTime();
                                var ageDate = new Date(ageDifMs); // miliseconds from epoch
                                return Math.abs(ageDate.getUTCFullYear() - 1970);
                            };
                            age = _calculateAge(accountInfo.dob);
                        }


                        // see what we can find out about the user's location to give a more descriptive message
                        if (accountInfo != null && accountInfo.userLocation != null) {

                            // location is limited to free play, so say you can't play there at all if we know the specific name
                            if (accountInfo.userLocation.name != null
                                && accountInfo.userLocation.name != ""
                                && accountInfo.userLocation.limitedToFreePlay) {

                                message = "Real money games are not offered in " + accountInfo.userLocation.name + ".";

                                // user may be in an allowed location but be too young, like 17 or something
                            } else if (accountInfo.userLocation.ageToPlay != null
                                && age != null
                                && age < accountInfo.userLocation.ageToPlay) {

                                if (accountInfo.userLocation.name != null
                                && accountInfo.userLocation.name != "") { // If we have the name, use that
                                    message = "You must be at least " + accountInfo.userLocation.ageToPlay + " to play for real money in " + accountInfo.userLocation.name + ".";
                                } else {
                                    // we don't have the name but we do have the age to play
                                    message = "You must be at least " + accountInfo.userLocation.ageToPlay + " to play for real money.";
                                }
                            }
                        }

                    } else if (statusID == FlowerCityGaming.V1.Constants.UserLocationVerificationStatus.ProcessPending) {
                        message = "Your verification is currently pending. Please contact support for more information.";
                    }

                    // pop open the dialog with the actual message
                    var modalInstance = $uibModal.open({
                        templateUrl: '/app/shared/modal/limitedToFreePlay/limitedToFreePlayModalView.html',
                        controller: 'limitedToFreePlayModalController',
                        scope: null,
                        size: 'sm',
                        resolve: {
                            message: function () {
                                return message;
                            }
                        }
                    });

                }).fail(function () { // getting the user's account info failed. Make the dialog with the default message
                    var modalInstance = $uibModal.open({
                        templateUrl: '/app/shared/modal/limitedToFreePlay/limitedToFreePlayModalView.html',
                        controller: 'limitedToFreePlayModalController',
                        scope: null,
                        size: 'sm',
                        resolve: {
                            message: function () {
                                return message;
                            }
                        }
                    });
                });
            } else {
                // User is not logged in, so open login dialog
                this.displayLoginModal();
            }
        }
    };
}]);