var AccountController = angular.module('AccountController', ['accountModals', 'genericModalService']);
AccountController.controller('AccountController', ['$scope', 'clientFactory', '$routeParams', '$location', 'accountModalService', 'GenericModal', function ($scope, clientFactory, $routeParams, $location, accountModalService, GenericModal) {
    //'use strict';

    // Only show the cashier tab if the user is verified for cash
    $scope.allowCash = false;
    accountModalService.runCashAction(
        function () { $scope.allowCash = true; },
        true);

    //specifies correct tab to open based on url. Use data-target name
    //i.e. http://localstatic.awesomedfs.com/#/my-account?tab=cashier
    if ($routeParams.tab != undefined || $routeParams.tab != '') {
        // Default to profile
        var requestedTab = "profile";
        var fnCallback = function () { requestedTab = $routeParams.tab; };

        // If cashier requested, then check and show dialog before trying to actually show cashier
        if ($routeParams.tab === "cashier" || $routeParams.tab === "bonueses") { accountModalService.runCashAction(fnCallback); }
        // Just assign away!
        else { fnCallback; }

        $('.nav-tabs a[data-target="#' + requestedTab + '"]').tab('show');
    }
        
        
    clientFactory.accounts().GetAccountByID(clientFactory.getAccountId())
    .done(function (accountinfo) {
        $scope.AccountInfo = accountinfo;
        
        if ($scope.AccountInfo.addresses.length > 0)
            $scope.Address = $scope.AccountInfo.addresses[0];

        $scope.$apply();
    })
    .fail(function (error) {
        FlowerCityGaming.V1.logError("Error loading account info");
    });
        

    clientFactory.accounts().GetAccountPreferences(clientFactory.getAccountId())
    .done(function (preferences) {
           
        $scope.PreferenceModel = {
            newsletter: preferences.newsLetterPromotion,
            game: preferences.gameNotification,
            referral: preferences.referralNotification,
            cashier: preferences.cashierNotifications,
            seasonleague: preferences.seasonGameNotification,
        };
        $scope.$apply();

    })
    .fail(function (error) {
        FlowerCityGaming.V1.logError("Error loading account preferences");
    });


    $scope.confirmNotificationChanges = function () {          
        var clientid = clientFactory.getAccountId();
        var prefs = {
            accountID: clientid,
            newsLetterPromotion: $scope.PreferenceModel.newsletter,
            gameNotification: $scope.PreferenceModel.game,
            referralNotification: $scope.PreferenceModel.referral,
            cashierNotifications: $scope.PreferenceModel.cashier,
            seasonGameNotification: $scope.PreferenceModel.seasonleague
        };
           
        clientFactory.accounts().UpdateAccountPreferences(clientFactory.getAccountId(), prefs)
            .done(function () {
                GenericModal.showModal('Preferences Updated', 'Thank you for updating your preferences.');
            })
            .fail(function (error) {
                GenericModal.showModal('Error', 'An error occured preventing us from updating your preferences. Please contact us if this error persists.');
                FlowerCityGaming.V1.logError("Error updating account preferences", error);
            });
    };
        

    // cashier
        

    // Build up the URL we're going to put in the cashier iframe

    // Start by searching the query string for a value "cashUri=cashier%2FPayPalCheckoutComplete%2F10%3Ferrors=false"
    // query regex taken from http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
    // which conveniently decodes the url (
    var querySearch = "cashUri".replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + querySearch + "=([^&#]*)");
    var queryResults = regex.exec(location.search);
    queryResults = (queryResults === null ? "" : decodeURIComponent(queryResults[1].replace(/\+/g, " ")));
    // Query results will now be something like "" or something like "cashier/PayPalCheckoutComplete/10?errors=false"

    // TODO: replace with client get cashier url
    var cashierUri = "http://cashier.flowercitygaming.com/";
    var cashierRoute = "Cashier/Index"; // default URL, make sure it doesn't end with "/"

    var addHistoryElement = false;
    // If we got something special, let's use that
    if (queryResults != null && queryResults != "") {
        addHistoryElement = true;
        // If we have /cashier/something or ?something=something
        // make .com/cashier/something or .com?something=somethign
        if (queryResults.startsWith("/") || queryResults.startsWith("?")) {
            cashierRoute = queryResults;
        }
        else // otherwise just assume it's a route
        {
            cashierRoute = "/" + queryResults;
        }

    } else if (window && window.idServerResponse && window.idServerResponse.AccessToken) {
        var cashierQString = "tenantid=4&accessToken=" + window.idServerResponse.AccessToken + "&UserID=" + clientFactory.getAccountId();

        // If we've got a query string already add the new stuff after it
        // so blah.com?a=b becomes blah.com?a=b&newstuff=blah
        // and blah.com becomes blah.com?newstuff=blah
        if (cashierRoute.indexOf("?") != -1) {
            cashierRoute += ("&" + cashierQString);
        } else {
            cashierRoute += ("?" + cashierQString);
        }
    }

    // either a.com/ and route/routething OR a.com and /route/routething
    if (
        ((!cashierRoute.startsWith("/") && cashierUri.endsWith("/"))
        ||
        (cashierRoute.startsWith("/") && !cashierUri.endsWith("/")))
        )
    {
        cashierUri = cashierUri + cashierRoute;
    } else if (cashierRoute.startsWith("/") && cashierUri.endsWith("/")) {
        cashierUri = (cashierUri + cashierRoute.substring(1)); // remove first character
    } else {
        cashierUri = (cashierUri + "/" + cashierRoute);
    }

    if (addHistoryElement) {
        window.onbeforeunload = function (e) {
            return "If you refresh, your transaction may be run through twice. Please wait until the page fully loads. Are you sure you want to reload?";
        };
    }
        
    document.getElementById('cashierInnerFrame').onload = function () {
        $('#cashierInnerFrame').iFrameResize();
        if (addHistoryElement) {
            window.onbeforeunload = null;

            // After calling the src, let's change the current refresh page so that way the user doesn't call it twice.
            // and then accidentally deducts money twice
            // The only way to call the page again would be to use the "back" button
            var baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + window.location.hash;
            window.history.pushState({ path: baseUrl }, '', baseUrl);
        }
    }
    $("#cashierInnerFrame").attr("src", cashierUri);

}]);