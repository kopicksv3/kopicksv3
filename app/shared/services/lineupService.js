var lineup = angular.module('lineupService', ['positionHeaders', 'genericModalService']);

lineup.service('Lineup', [ '$rootScope', '$uibModal', 'clientFactory', 'positionService', 'GenericModal', function ($rootScope, $uibModal, clientFactory, positionService, GenericModal) {
    //'use strict';
    var _positions = null;
    var _maxSalary = 100000;
    var _fantasyTeam = {};
    var _openSlots = 10;
    var _remainingSalary = 100000;
    var _errors = [];

    /*
     * Binds the fantasyTeam lineup to the view
     */
    this.getFantasyLineup = function () {
        $rootScope.$broadcast('getFantasyLineup', _fantasyTeam.lineup);
        return _fantasyTeam.lineup;
    };

    /*
     * Sets the current lineup - currently through a client call in the controller
     * 
     * @param: fanatasyTeam - team being edited
     */
    this.setFantasyLineup = function (fantasyTeam) {       
        _remainingSalary = 100000;
        _fantasyTeam = fantasyTeam;        
        _positions = positionService.getHeaders(_fantasyTeam.leagueID, null);
       

        var _lineup = _fantasyTeam.lineup;
        setLineup(_lineup);
    };

    /*
     * Adds a player to the lineup if there is an appropriate slot
     * 
     * @param: player - player to be added
     */
    this.addPlayer = function (player) {        
        var _lineup = _fantasyTeam.lineup;        
        if (inLineup(player)) {
            // add logic to follow
            GenericModal.showModal("Error", "Player already in lineup.");
            
        } else {
            var added = false;
            for (var i = 0; i < _lineup.length; i++) {                
                if (_lineup[i].personID == 0 && inPosition(_lineup[i].position, player)) {
                    
                    addPlayer(i, player);
                    added = true;
                    break;
                }
            }
            if (!added) {
                GenericModal.showModal("Error", "All lineup slots filled for the " + player.position + " position.")                
            }
            
        }        
    }    

    /*
     * Removes a player from the lineup
     * 
     * @param player - the play to be cleared
     */
    this.removePlayer = function (player) {
        var _lineup = _fantasyTeam.lineup;        
        for (var i = 0; i < _lineup.length; i++) {
            if (player.personID == _lineup[i].personID) {                
                clearPlayer(i);
                break;
            }
        }
        
    }

    /*
     * Clears all the current players in a lineup
     */
    this.clearLineup = function () {
        var _lineup = _fantasyTeam.lineup;
        for (var i = 0; i < _lineup.length; i++) {
            if (_lineup[i].personID > 0) {
                clearPlayer(i);
            }
        }
    }

    /*
     * Attempts to save the lineup
     */
    this.saveLineup = function ($scope) {        
        var toSave = formatSave();
        clientFactory.fantasyTeams().ModifyFantasyTeam(_fantasyTeam.fantasyTeamID, toSave).
        done(function (result) {
            if (result.errors.length > 0) {                
                setErrors(result.errors);
            }
            else {
                noErrors();
                $scope.exportFantasyLeagueID = _fantasyTeam.fantasyLeagueID;
                $scope.exportFantasyTeamID = _fantasyTeam.fantasyTeamID;
                $scope.exportFantasyTeam = toSave.roster;
                modalInstance = $uibModal.open({
                templateUrl: 'savedLineups.html',
                    controller: 'savedLineupController',
                    scope: $scope,
                    resolve: {
                        items: function () {
                            return $scope.items;
                        }
                    }
                });

            }
            $rootScope.$digest();
        }).
        fail(function (err) {
            setErrors(err);                 
            $rootScope.$digest();
        });

    }

    /*
     * called to update the model when a lineup has been imported
     */
    this.updateLineup = function (lineup) {
        _remainingSalary = _maxSalary;
        _fantasyTeam.lineup = lineup;
        setLineup(lineup);
    }            

    /*
     * Returns the remaining salary
     */
    this.getRemainingSalary = function () {
        return _remainingSalary;
    }

    /*
     * Returns the average salary for the ammount of slots left
     */
    this.averageRemainingSalary = function () {
        var ars = 0;
        if (_openSlots != 0) ars = _remainingSalary / _openSlots;
        $rootScope.$broadcast('averageRemainingSalary', ars);
        return ars;
            
    }

    /*
     * 
     */
    this.showExportModal = function ($scope) {
        $scope.exportFantasyLeagueID = _fantasyTeam.fantasyLeagueID;
        $scope.exportFantasyTeamID = _fantasyTeam.fantasyTeamID;
        var exportTeam = formatSave();
        $scope.exportFantasyTeam = exportTeam.roster;
                
        var modalInstance = $uibModal.open({
            templateUrl: 'exportLineupsID.html',
            controller: 'exportLineupsController',
            scope: $scope,
            size: 'lg',
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
    };
        
    /*
     * 
     */
    this.showImportModal = function ($scope) {        
        $scope.importFantasyLeagueID = _fantasyTeam.fantasyLeagueID;
        $scope.importFantasyTeamID = _fantasyTeam.fantasyTeamID;
        var exportTeam = formatSave();
        $scope.importFantasyTeam = exportTeam.roster;

        modalInstance = $uibModal.open({
            templateUrl: 'importLineupID.html',
            controller: 'importLineupsController',
            scope: $scope,
            size: 'lg',
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });
    }

    /*
     * Displays errors
     */
    this.hasErrors = function () {
        return _errors;
    }

    /*
     * Returns a modifiable instance of a Fantasy Team
     */
    function formatSave() {
        var account = clientFactory.getAccountId();

        var toSave = new FlowerCityGaming.V1.Models.FantasyTeamModify(account, _fantasyTeam.fantasyTeamID, _fantasyTeam.lineup);
        return toSave;
    }


    /*
     * No errors have occured with the lineup
     */
    function noErrors() {        
        _errors = [];

    }

    /*
     * An errors has occured with the lineup
     */
    function setErrors(messages) {
        _errors = [];
        for (error in messages) {            
            _errors.push(messages[error]);            
        }        
    }

    /*
     * Helper function to set the lineup
     */
    function setLineup(lineup) {
        _openSlots = lineup.length;
        for (var i = 0; i < lineup.length; i++) {            
            // if there is a player in the slot, decrement _openSlots, compute _remainingSalary
            if (lineup[i].personID > 0) {
                _openSlots--;
                _remainingSalary -= lineup[i].salary;
            } else {
                lineup[i].salary = 0;
            }
        }
        noErrors();
    }

    /*
     * Helper function to handle Add Player logic
     */
    function addPlayer(slot, player) {
        // eventually add in logic to deal with NFL DEF position
        if (player.positionID == FlowerCityGaming.V1.Constants.Position.NFL_DST) {
            _fantasyTeam.lineup[slot].personID = player.teamID;
            _fantasyTeam.lineup[slot].isTeam = true;
        }
        else {
            _fantasyTeam.lineup[slot].personID = player.id;
        }

        _fantasyTeam.lineup[slot].firstName = player.name.split(' ')[0];
        _fantasyTeam.lineup[slot].lastName = player.name.split(' ')[1];
        _remainingSalary -= player.salary;
        _fantasyTeam.lineup[slot].salary = player.salary;
        _openSlots--;                
    }

    /*
     * Helper function to handle Remove Player logic
     */
    function clearPlayer(slot) {
        _fantasyTeam.lineup[slot].personID = 0;
        _fantasyTeam.lineup[slot].firstName = "";
        _fantasyTeam.lineup[slot].lastName = "";
        _fantasyTeam.lineup[slot].isTeam = false;
        _remainingSalary += _fantasyTeam.lineup[slot].salary;
        _fantasyTeam.lineup[slot].salary = 0;
        _openSlots++;
    }

    /* Helper function to see if a players position is compatable with a certain lineup slot*/
    function inPosition(slot, player) {        
        for (var i = 0; i < _positions.length; i++){
            // Checks to see what            
            if (_positions[i].id == slot) {
                
                if (_positions[i].values.indexOf(player.position) != -1) {
                    return true;
                }
            }
        }
        return false;
    }

    /*
     * Checks to see if the player is already in the lineup
     * 
     * NOTE: This could possbily be broken out into it's own method, a similar method is used in playerGridController.js
     */
    function inLineup(player) {
        var _lineup = _fantasyTeam.lineup;
        for (var i = 0; i < _lineup.length; i++) {
            if (_lineup[i].personID == player.id && player.id != 0) {
               return true;
            }
            else if (_lineup[i].positionID == FlowerCityGaming.V1.Constants.Position.NFL_DST && _lineup[i].personID == player.teamID && player.id == 0) {
                return true;
            }
        }
        return false;
    }

}]);