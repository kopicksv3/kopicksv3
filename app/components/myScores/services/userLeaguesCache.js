
/*
 * Service that caches GetActiveFantasyLeaguesForAccount and GetCompleteFantasyLeaguesForAccount. So that multiple API do not need to be made for each controller.
 */

var scoresServices = angular.module("scoresServices", []);

scoresServices.factory('userLeaguesCache', ['$cacheFactory', 'clientFactory', '$q', function userLeaguesCache($cacheFactory, clientFactory, $q) {
    //'use strict';

    //Returned service
    var service = {};

    //Get the cache for scoring related pages
    var _cache = $cacheFactory('scores');


    //Takes in an account ID and reads the cache value for the accountID
    //If no value is found undefined is returned
    var readCacheActive = function (accountID) {
        var cacheObj = _cache.get(accountID);
        return typeof cacheObj == 'undefined' ? undefined : cacheObj.active;
    };

    //Writes the given promise to the active leagues object for this account
    var writeCacheActive = function (accountID, active) {
        var cacheObj = readCacheActive(accountID);
        if (typeof cacheObj == 'undefined') {
            cacheObj = {};
        }
        cacheObj.active = active;

        _cache.put(accountID, cacheObj);
    };

    //Takes in an account ID and reads the cache value for the accountID
    //If no value is found undefined is returned
    var readCacheComplete = function (accountID) {
        var cacheObj = _cache.get(accountID);
        return typeof cacheObj == 'undefined' ? undefined : cacheObj.complete;
    };

    //Writes the given promise to the complete leagues object for this account
    var writeCacheComplete = function (accountID, complete) {
        var cacheObj = readCacheComplete(accountID);
        if (typeof cacheObj == 'undefined') {
            cacheObj = {};
        }
        cacheObj.complete = complete;

        _cache.put(accountID, cacheObj);
    };



    //Gets the active leagues for the specified account ID
    //useCache - If true will look in the cache for the activeLeagues, if it does not exist then it will store the value.
    service.getActiveLeagues = function (accountID, useCache, filterInvalid) {
        //Local promise that will be returned for this request
        var promise = $q.defer();

        //Check and see if this call has been made alredy.
        var existingPromise = readCacheActive(accountID);

        //If the call has already been made or the user does not want to use the cached value
        if (typeof existingPromise == 'undefined' || !useCache) {

            //Cache this promise for later calls
            writeCacheActive(accountID, promise);

            //Make the call and resolve the promise
            clientFactory.accounts().GetActiveFantasyLeaguesForAccount(accountID)
                .done(function (activeLeagues) {
                    
                    activeLeagues.sort(function (a, b) {
                        return a.leagueID - b.leagueID;
                    });
                    activeLeagues = activeLeagues.filter(function (obj) {
                        return (obj.statusID == FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.RUNNING);
                    });

                    if (filterInvalid) {
                        activeLeagues = activeLeagues.filter(function (obj) {
                            return (obj.isValid == true);
                        });
                    }
                    promise.resolve(activeLeagues);
                })
                .fail(function (error) {
                    promise.reject(error);    
                });
        }
        else {
            //We already have this promise storecd and the user wants the cached version if available
            promise = existingPromise;
        }

        return promise.promise;
    };

    //See above method (it works the same)
    service.getCompleteLeagues = function (accountID, useCache, fromDate, filterInvalid) {
        var promise = $q.defer();
        var existingPromise = readCacheComplete(accountID);
        if (typeof existingPromise == 'undefined' || !useCache) {
            writeCacheComplete(accountID, promise);
            clientFactory.accounts().GetCompletedFantasyLeaguesForAccount(accountID, fromDate = fromDate)
                .done(function (completeLeagues) {
                    completeLeagues.sort(function (a, b) {
                        return a.leagueID - b.leagueID;
                    });
                    completeLeagues = completeLeagues.filter(function (obj) {
                        return (obj.statusID !== FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.CLOSED
                                && obj.statusID !== FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.CANCELED
                                && obj.statusID !== FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.OPEN
                                && obj.statusID !== FlowerCityGaming.V1.Constants.FantasyLeagueStatusID.DRAFTING
                            );

                    if (filterInvalid) {
                        completeLeagues = completeLeagues.filter(function (obj) {
                            return (obj.isValid == true);
                        });
                    }

                    
                });
                    promise.resolve(completeLeagues);
                }).fail(function (error) {
                    promise.reject(error);
                });
        }
        else {
            promise = existingPromise;
        }

        return promise.promise;
    };


    return service;
}]);