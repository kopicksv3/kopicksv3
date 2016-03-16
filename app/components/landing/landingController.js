var LandingController = angular.module('landingController', []);

LandingController.controller('landingController', ['$scope', 'accountModalService', function ($scope, accountModalService) {
    //'use strict';
    
    $scope.displayRegisterModal = function () {
        accountModalService.displayRegisterModal();
    };
}]);

