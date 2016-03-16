var resetPasswordController = angular.module('ResetPasswordController', []);

resetPasswordController.controller('ResetPasswordController', ['$scope', '$http', '$window', 'clientFactory', 'locationVerificationModalService', function ($scope, $http, $window, clientFactory, locationVerificationModalService) {
    //'use strict';
    // Start by searching the query string for a value "resetparams=id%3Dd0a783830399e337be2cad7489f10205%26username%3Dko_register_10%26tkn%3D4e18136b-bbcd-47ce-a37b-751c307995ae"
    // query regex taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    // which conveniently decodes the value
    var querySearch = "resetparams".replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
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
            // idParameters = {id: "asdf", username: "asdf", tkn: "asdf"}

            var passwordResetUrl = FlowerCityGaming.V1.IdentityServer.preparePasswordResetUrl(
                idParameters["id"],
                idParameters["username"],
                idParameters["tkn"]);

            FlowerCityGaming.V1.logMessage("Setting password reset iframe to url: " + passwordResetUrl);
            $scope.passwordResetUrl = passwordResetUrl;
        }

        document.getElementById('passwordResetInnerFrame').onload = function () {
            $('#passwordResetInnerFrame').iFrameResize({
                heightCalculationMethod: 'lowestElement'
            });
        }
    }
}]);