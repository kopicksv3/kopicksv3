var accountLocked = angular.module('accountLockedController', []);

accountLocked.controller('accountLockedController', ['$scope', 'clientFactory', function ($scope, clientFactory) {
    //'use strict';
    // Start by searching the query string for a value "Username=dudeiscool"
    // query regex taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    // which conveniently decodes the value
    var querySearch = "Username".replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + querySearch + "=([^&#]*)");
    var queryResults = regex.exec(location.search);
    queryResults = (queryResults === null ? "" : decodeURIComponent(queryResults[1].replace(/\+/g, " ")));
    // Query results will now be something like "" or something like "dudeiscool"

    if (queryResults != "") {
        var preppedUrl = FlowerCityGaming.V1.IdentityServer.prepareUnlockAccountUrl(queryResults);
        $scope.unlockAccountUrl = preppedUrl;

        document.getElementById('unlockAccountIFrame').onload = function () {
            $('#unlockAccountIFrame').iFrameResize({
                heightCalculationMethod: 'lowestElement'
            });
        };

    } else {
        // some kind of warning?
    }
}]);