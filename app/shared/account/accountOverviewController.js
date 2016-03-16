var AccountOverviewController = angular.module("AccountOverviewController", []);

AccountOverviewController.controller('AccountOverviewController', ['$scope', 'clientFactory', function ($scope, clientFactory) {
    //'use strict';
    $scope.leaders = null;
   
    clientFactory.accounts().GetAccountByID(clientFactory.getAccountId())
        .done(function (account) {
            $scope.account = account;
            $scope.$apply();
        });
}]);