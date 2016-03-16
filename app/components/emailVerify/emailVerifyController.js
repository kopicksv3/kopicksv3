var EmailVerifyController = angular.module('EmailVerifyController', []);

EmailVerifyController.controller('EmailVerifyController', ['$scope', '$http', '$window', 'clientFactory', 'locationVerificationModalService', function ($scope, $http, $window, clientFactory, locationVerificationModalService) {
    //'use strict';
    // Read "userEmail" from the querystring and use it for the form

    // Start by searching the query string for a value "userEmail=example%40email.com"
    // query regex taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    // which conveniently decodes the value
    var querySearch = "userEmail".replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + querySearch + "=([^&#]*)");
    var queryResults = regex.exec(location.search);
    queryResults = (queryResults === null ? "" : decodeURIComponent(queryResults[1].replace(/\+/g, " ")));
    // Query results will now be something like "" or something like "example@email.com"

    var emailVerifyUrl = FlowerCityGaming.V1.IdentityServer.prepareResendEmailVerificationUrl(queryResults);

    document.getElementById('emailVerifyIframe').onload = function () {
        $('#emailVerifyIframe').iFrameResize({
            heightCalculationMethod: 'lowestElement'
        });
    };

    $scope.emailVerifyUrl = emailVerifyUrl;
}]);