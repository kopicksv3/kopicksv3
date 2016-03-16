var emailVerifyCallbackController = angular.module('EmailVerifyCallbackController', []);

emailVerifyCallbackController.controller('EmailVerifyCallbackController', ['$scope', '$http', '$window', 'clientFactory', 'accountModalService', 'locationVerificationModalService', function ($scope, $http, $window, clientFactory, accountModalService, locationVerificationModalService) {
    //'use strict';

    FlowerCityGaming.V1.CrossDocumentMessaging.subscribe(FlowerCityGaming.V1.Constants.ClientConstants.CrossDocumentMessageType.EmailVerificationResult, function (message) {
        FlowerCityGaming.V1.logMessage("Got email verify result", message);
        FlowerCityGaming.V1.logMessage(FlowerCityGaming.V1.Constants.ClientConstants.EmailVerificationResult[message.message]);

        var wentSomewhere = false;
        if (message.message == FlowerCityGaming.V1.Constants.ClientConstants.EmailVerificationResult.EmailNowVerified
            || message.message == FlowerCityGaming.V1.Constants.ClientConstants.EmailVerificationResult.AlreadyVerified) {

            if (!FlowerCityGaming.V1.IdentityServer.isTokenExpired() && (clientFactory.getAccountId() != null)) {
                wentSomewhere = true;
                window.location.assign("#/lobby"); // navigate to the lobby but don't actually reload the page

                // user is logged in already
                FlowerCityGaming.V1.IdentityServer.processAuthRefreshEmailVerifyCompleteCallback();
            } else {
                wentSomewhere = true;
                window.location.assign("#/lobby"); // navigate to the lobby but don't actually reload the page
                // Set the callback URL to the callback URL that brings up the "you've signed up!" dialog
                FlowerCityGaming.V1.IdentityServer.configuration.authenticationCompletedCallbackEndpoint = "/auth_refresh_complete_email_verify_complete.html";
                accountModalService.displayLoginModal();
            }
        } else if (message.message == FlowerCityGaming.V1.Constants.ClientConstants.EmailVerificationResult.InvalidToken) {
            // redirect the user back to the email verify page
            window.location.assign("/#/emailVerify");
            window.location.reload(); // Required as above location is only changing via hash
            wentSomewhere = true;
        }

        if (!wentSomewhere) {
            // make sure the user actually gets to the lobby 
            window.location.assign("#/lobby"); // navigate to the lobby but don't actually reload the page
        }
    });

    // Start by searching the query string for a value "verificationparams=id%3Dasdf%26username%3Dasdf%26tkn%3Dasdf"
    // query regex taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    // which conveniently decodes the value
    var querySearch = "verificationparams".replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + querySearch + "=([^&#]*)");
    var queryResults = regex.exec(location.search);
    queryResults = (queryResults === null ? "" : decodeURIComponent(queryResults[1].replace(/\+/g, " ")));
    // Query results will now be something like "" or something like "id=asdf&username=asdf&tkn=asdf"

    if (queryResults != "") {
        var qTerms = queryResults.split("&");
        // qTerms = ["id=asdf", "username=asdf", "tkn=asdf"]
        if (qTerms && qTerms.length && qTerms.length > 0) {
            var idParameters = {};
            for (var i in qTerms) {
                var term = qTerms[i]; // id=asdf
                var termsplit = term.split("="); // ["id", "asdf"]
                if (termsplit && termsplit.length && termsplit.length == 2) {
                    var fieldName = termsplit[0]; // "id"
                    var fieldValue = termsplit[1]; // "asdf"
                    idParameters[fieldName] = fieldValue; // { a = 2, b = 4, id = "asdf" }
                }
            }

            idParameters["TenantID"] = 4;
            idParameters["CallbackUrl"] = window.location.origin + "/email_verify_response.html";
            // idParameters = {id: "asdf", username: "asdf", tkn: "asdf"}

            var emailVerifyUrl = FlowerCityGaming.V1.IdentityServer.prepareEmailVerificationUrl(
                idParameters["id"],
                idParameters["username"],
                idParameters["tkn"]);

            FlowerCityGaming.V1.logMessage("Setting email verify iframe to url: " + emailVerifyUrl);
            $("#emailVerificationInnerFrame").attr("src", emailVerifyUrl);
        }
    } else {
        window.location.assign("#/lobby");
    }
}]);