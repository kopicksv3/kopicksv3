var genericModalService = angular.module('genericModalService', []);

genericModalService.service('GenericModal', ['$rootScope', '$uibModal', 'clientFactory', function ($rootScope, $uibModal, clientFactory) {
    this.showModal = function (modalTitle, modalMessage) {        
        $rootScope.titleService = modalTitle;
        $rootScope.msgService = modalMessage;
        var modalInstance = $uibModal.open({
            templateUrl: 'genericModal.html',
            size: 'sm',
            controller: 'genericPopupController',
            backdrop: 'static'

        });
    };
}]);

genericModalService.controller('genericPopupController', ['$scope', '$uibModalInstance', 'clientFactory', function ($scope, $uibModalInstance, clientFactory) {

    $scope.title = $scope.titleService;
    $scope.message = [];
    if ($scope.msgService != null) {
        $scope.message = $scope.msgService;
        
        if (!($scope.msgService.constructor === Array)) {
            $scope.message = $scope.msgService.split(';');
        }
        else {
            $scope.message = $scope.msgService;
        }
    }
    else { $scope.message = "An Error has occurred.";}

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

}]);
