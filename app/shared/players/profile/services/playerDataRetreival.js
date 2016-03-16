/*this service takes in brief overview data and normalizes it*/
var profileStatsHeaderDirectives = angular.module('profileStatsHeaderDirectives');


profileStatsHeaderDirectives.factory('playerDataRetrieval', ['clientFactory', '$q', function (clientFactory, $q) {
    //'use strict';
    var service = {};
    var normalizeBrief = function(data,sportID)
    {
        for (var x = 0; x < data.length; x++) {
            var label = '';
            if (x == 0)
            {
                data[x].label = 'Last Game';
            }else if(x == 1 && data.length == 3)
            {
                data[x].label = 'Last 15';
            }
            else
            {
                data[x].label = 'Season';
            }
        }
        return data;
    }

    var normalizeGameLog = function(data)
    {
        return data
    }

    var normalizeSeasonSplit = function(data)
    {
        return data;
    }

    var normalizeCareerInfo = function(data)
    {
        return data;
    }

    /*Takes in information about a player and returns data about them*/
    service.getbriefOverview = function(playerID, positionID, seasonID,sportID)
    {
        return $q(function (resolve, reject) {
            clientFactory.player().GetBriefOverview(playerID, positionID, seasonID).then(function (data) {
                resolve(normalizeBrief(data,sportID));
            });
        });
    }

   
    /*Takes in information about a player and retruns game log information about that player*/
    service.getGameLog = function(playerID,positionID,seasonID)
    {
        return $q(function (resolve, reject) {
            clientFactory.player().GetGameLog(playerID, positionID, seasonID)
            .then(function (data) {
                resolve(normalizeGameLog(data));
            });


        });
    }

    service.getSeasonSplits = function (playerID,positionID,seasonID) {
        return $q(function (resolve, reject) {
            clientFactory.player().GetSeasonSplit(playerID, positionID, seasonID)
            .then(function (data) {
                resolve(normalizeSeasonSplit(data));
            });
        });
    }

    service.getCareer = function(playerID,positionID,seasonID)
    {
        return $q(function (resolve, reject) {
            clientFactory.player().GetCareerStats(playerID, positionID, seasonID)
            .then(function (data) {
                resolve(normalizeCareerInfo(data));
            })
        });
    }
    return service;
}]);
