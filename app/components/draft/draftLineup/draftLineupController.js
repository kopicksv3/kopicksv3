var draftLineup = angular.module('draftLineup', ['lineupService']);

draftLineup.controller('draftLineupController', ['$scope', '$routeParams','$rootScope', '$uibModal', 'clientFactory', 'Lineup', function ($scope, $routeParams, $rootScope, $uibModal, clientFactory, Lineup) {
    //'use strict';
    
    clientFactory.fantasyTeams().GetFantasyTeamByID($routeParams.fantasyTeamID).
    done(function (fTeam) {
        
        Lineup.setFantasyLineup(fTeam);
        $scope.lineupMod = Lineup.getFantasyLineup;
        $scope.remainingSalary = Lineup.getRemainingSalary;
        $scope.averageRemainingSalary = Lineup.averageRemainingSalary;
        $scope.clearLineup = Lineup.clearLineup;
        $scope.errors = Lineup.hasErrors;
        
    }).
    fail(function (error) {
        FlowerCityGaming.V1.logMessage(error);
    });

    $scope.removePlayer = function (slot) {
        Lineup.removePlayer(slot);
    };

    $scope.onChangeArs = function (arsBox) {
        $rootScope.$broadcast('onChangeArs', arsBox);
    };

    $scope.saveLineup = function () {
        Lineup.saveLineup($scope);
    };

    $scope.showExportModal = function () {
        Lineup.showExportModal($scope);
    };

    $scope.showImportModal = function () {
        Lineup.showImportModal($scope);
    };

    $scope.$on("addPlayerToLineup", function (event, player) {
        Lineup.addPlayer(player);
    });
    
    $scope.$on('savedLineup', function (event, team) {
        Lineup.updateLineup(team);       
    });

}]);

draftLineup.controller('savedLineupController', ['$scope', '$uibModalInstance', '$uibModal', 'clientFactory', function($scope, $uibModalInstance, $uibModal, clientFactory){
    $scope.ok = function () {
        $uibModalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.exportLineupToOtherLeagues = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'exportLineupsID.html',
            controller: 'exportLineupsController',
            scope : $scope,
            size : 'lg'
        });
    };
}]);