//Not sure this controller defintion should be in this file. It should probably be moved next to the view
angular.module('profileStatsHeaderDirectives').controller('commonProfileSection', ['$scope','appConstants','clientFactory', function ($scope,appConstants,clientFactory) {
    //'use strict';
    $scope.headshotServerAddress = appConstants.headshotServer;

    /*
     *Check if the incoming activePlayer variable has basic information attached. If not then make a web api call for them. 
     */
    $scope.$watchCollection('activePlayer', function (newVal, oldVal) {    
        if (angular.isDefined(newVal) && (!angular.isDefined($scope.activePlayer) || !angular.isDefined($scope.activePlayer.statistics))) {
            clientFactory.player().GetPlayerBasicInfo(newVal.playerID, newVal.gameID)
            .then(function (basicInfo) {
                FlowerCityGaming.V1.logMessage("Basic Info", basicInfo);
                statistics = {};
                $scope.activePlayer.name = basicInfo.playerName;
                statistics.teamCity = basicInfo.teamCity;
                statistics.teamName = basicInfo.teamName;

                var position = FlowerCityGaming.V1.Constants.Position[basicInfo.positionID];
                position = position.indexOf('_') !== -1 ? position.split('_')[1] : position;
                statistics.position = position;
                statistics.playerNumber = basicInfo.playerNumber;
                $scope.activePlayer.statistics = statistics;
            });
        }
    });
}]);

