var RegisterController = angular.module('RegisterController', []);

RegisterController.controller('registerController', ['$scope', '$http', '$window', '$uibModalInstance', 'clientFactory', function ($scope, $http, $window, $uibModalInstance, clientFactory) {

    FlowerCityGaming.V1.CrossDocumentMessaging.subscribe(FlowerCityGaming.V1.Constants.ClientConstants.CrossDocumentMessageType.RegistrationCompleted, function (message) {
        FlowerCityGaming.V1.logMessage("Got registration complete message", message);
        var userEmail = message.message;

        var redirectUrl = window.location.origin;

        if (userEmail != null && userEmail != "") {
            redirectUrl += "?userEmail=" + encodeURIComponent(userEmail);
        }

        redirectUrl += "#/emailVerify";

        window.location = redirectUrl;
    });

    var idServerUrl = FlowerCityGaming.V1.IdentityServer.prepareRegistrationUrl();
    // set the ID server url for registration. We're also sending the terms and conditions URL along with the URL
    // we need to do this because the iframe can't access our site's url. Note that the url is actually /Home/TermsOfUse
    // We do that because if you use a /#/terms-of-use in our method of POSTing urls out of the iframe, firefox and IE
    // don't treat it properly. So, we go to the /Home/TermsOfUse, which has a rewrite in the web.config to the /#/terms-of-use
    // page

    $scope.idServerEndpoint = (idServerUrl + "&TermsUrl=" + encodeURIComponent(window.location.origin + "/Home/TermsOfUse"));

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);