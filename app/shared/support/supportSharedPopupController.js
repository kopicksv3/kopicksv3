var supportSharedPopupController = angular.module('supportSharedPopupController', []);

supportSharedPopupController.controller('supportSharedPopupController', ['$scope', '$location', '$uibModal', function ($scope, $location, $uibModal) {

    $scope.displaySupportModal = function () {
        var modalInstance = $uibModal.open({
            templateUrl: '/app/shared/modal/support/supportModalView.html',
            controller: 'supportModalController',

            scope: null,
            resolve: { }
        });
    };

}]);