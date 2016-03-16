var validStatesController = angular.module('validStatesController', ['errorMessages']);

validStatesController.controller('validStatesController', ['$scope', '$location', 'clientFactory', '$uibModal', 'errorFactory', function ($scope, $location, clientFactory, $uibModal, errorFactory) {
    clientFactory.locations().GetAllStates()
    .done(function (allStates) {
        $scope.statesAllowedUSA = [];
        $scope.statesNotAllowedUSA = [];
        $scope.statesAllowedCAN = [];
        $scope.statesNotAllowedCAN = [];
        $scope.age19USA = [];
        $scope.age19CAN = [];
        $scope.age19ALL = [];
        $scope.age21USA = [];
        $scope.age21CAN = [];
        $scope.age21ALL = [];
        $scope.statesNotAllowedALL = [];

        for (var i = 0; i < allStates.length; i++) {
            var state = allStates[i];
            //valid states in USA
            if (state.appAllowed && state.countryID == FlowerCityGaming.V1.Constants.Countries.UNITED_STATES)
                $scope.statesAllowedUSA.push(state);
            else if (state.countryID == FlowerCityGaming.V1.Constants.Countries.UNITED_STATES)
                $scope.statesNotAllowedUSA.push(state);

            //valid states in Canada
            if (state.appAllowed && state.countryID == FlowerCityGaming.V1.Constants.Countries.CANADA)
                $scope.statesAllowedCAN.push(state);
            else if (state.countryID == FlowerCityGaming.V1.Constants.Countries.CANADA)
                $scope.statesNotAllowedCAN.push(state);
            
            //must be 19 to play in USA
            if (state.countryID == FlowerCityGaming.V1.Constants.Countries.UNITED_STATES && state.ageToPlay == 19 && state.appAllowed)
                $scope.age19USA.push(state);

            //must be 19 to play in Canada
            if (state.countryID == FlowerCityGaming.V1.Constants.Countries.CANADA && state.ageToPlay == 19 && state.appAllowed)
                $scope.age19CAN.push(state);

            //must be 19 to play ALL LOCATIONS
            if (state.ageToPlay == 19 && state.appAllowed)
                $scope.age19ALL.push(state);

            //must be 21 to play in USA
            if (state.countryID == FlowerCityGaming.V1.Constants.Countries.UNITED_STATES && state.ageToPlay == 21 && state.appAllowed)
                $scope.age21USA.push(state);

            //must be 21 to play in Canada
            if (state.countryID == FlowerCityGaming.V1.Constants.Countries.CANADA && state.ageToPlay == 21 && state.appAllowed)
                $scope.age21CAN.push(state);

            //must be 21 to play ALL LOCATIONS
            if (state.ageToPlay == 21 && state.appAllowed)
                $scope.age21ALL.push(state);

            //no cash actions at all
            if (!state.appAllowed)
                $scope.statesNotAllowedALL.push(state);
        }


        $scope.$apply();
    })
    .fail(function (error) {
        FlowerCityGaming.V1.logMessage(error);
        errorFactory.displayErrors(error, "Error getting states");
        //GenericModal.showModal('Error', error.message);
        $scope.$apply();
    });
}]);

