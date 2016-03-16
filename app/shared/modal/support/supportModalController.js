var supportModalController = angular.module("supportModalController", []);

supportModalController.controller('supportModalController', ['$scope', 'clientFactory', '$uibModalInstance', 'appConstants', function ($scope, clientFactory, $uibModalInstance, appConstants) {
    //'use strict';
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.supportEmail = appConstants.supportEmail;

    $scope.supportTicket = {};

    $scope.isLoggedIn = (!FlowerCityGaming.V1.IdentityServer.isTokenExpired() && clientFactory.getAccountId());
    $scope.supportTicket.UserName = $scope.isLoggedIn ? clientFactory.getUserName() : "";

    $scope.supportTicketSuccess = false;
    $scope.genericError = false;
    $scope.majorFailError = false;
    $scope.genericErrorMessages = [];

    //$scope.error_UserName = false;
    //$scope.errorMessage_UserName = "";
    //$scope.error_Email = false;
    //$scope.errorMessage_Email = "";
    //$scope.error_Subject = false;
    //$scope.errorMessage_Subject = "";
    $scope.error_Message = false;
    $scope.errorMessage_Message = "";

    $scope.sendSupport = function (supportTicket) {
        // We have to lowercase each field
        var newModel = {};
        for (var key in supportTicket) {
            try
            {
                var newKey = key.substr(0, 1).toLowerCase() + key.substr(1); // transform "KeyThing" to "keyThing"
                newModel[newKey] = supportTicket[key];
            } catch (exc) {}
        }

        newModel.tenantID = appConstants.tenantID;

        FlowerCityGaming.V1.logMessage("Support Ticket", newModel);

        // both success and fail may have an errors array, so run them through this function
        var handleResponse = function (serverResponse, isFailErrorCode) {

            // attempt to find any errors
            var errorsFound = false;

            if (serverResponse != null && serverResponse.errors != null && serverResponse.errors.length && serverResponse.errors.length > 0) {
                var errorStrings = [];

                // go through the errors and clean them up
                for (var i in serverResponse.errors) {
                    if (!isNaN(parseInt(i, 10))) {
                        var valError = serverResponse.errors[i];
                        // If it starts with "incident " ("incident email is required")
                        // remove the "incident "
                        var toRemove = "incident "
                        if (valError.slice(0, toRemove.length) == toRemove) {
                            valError = valError.replace(toRemove, "");
                        }

                        // We now have something like "email is required"
                        if (!valError.endsWith("."))
                            valError += ".";

                        // capitalize the first letter
                        valError = valError.substr(0, 1).toUpperCase() + valError.substr(1); // transform "email" to "Email"
                        errorStrings.push(valError);
                    }
                }

                // If we collected any errors, display them
                if (errorStrings.length > 0) {
                    $scope.supportTicketSuccess = false;
                    $scope.majorFailError = false;
                    $scope.genericError = true;
                    $scope.genericErrorMessages = errorStrings;
                    errorsFound = true;
                }
            }

            // We displayed nothing up above. That means it was either a complete success or a total failure
            if (!errorsFound) {
                // If this is from a result of a failed server request (like a 400 or 500), display there was an error
                if (isFailErrorCode) {
                    $scope.supportTicketSuccess = false;
                    $scope.majorFailError = true;
                    $scope.genericError = false;
                    $scope.genericErrorMessages = [];
                } else { // Otherwise it was a total success
                    $scope.supportTicketSuccess = true; // show the success message
                    $scope.majorFailError = false;
                    $scope.genericError = false;
                    $scope.genericErrorMessages = [];
                }
            }

            $scope.$apply();
        };

        clientFactory.supportIncidents().CreateSupportIncident(newModel)
            .done(function (response) {
                FlowerCityGaming.V1.logMessage("CreateSupportIncident response: ", response);
                handleResponse(response, false);
                
            }).fail(function (err) {
                FlowerCityGaming.V1.logMessage("CreateSupportIncident fail response: ", err);
                handleResponse(err, true);
            });
    }
}]);