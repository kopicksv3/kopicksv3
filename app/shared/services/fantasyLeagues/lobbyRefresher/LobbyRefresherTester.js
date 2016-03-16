var lobbyModule = angular.module('fantasyLeagueServices');


/*
 * Deals with updating fantasy league data for the lobby.
 * 
 * The client will call getAllOpenLeagues which will return a promise containing all fantasy leagues
 * They will also supply two callback functions to getAllOpenLeagues. One that is called when the entire list of fantasy leagues needs to be updated, the other
 * will be called whenever one or more fantasy leagues have changed.
 */
lobbyModule.factory('lobbyRefresher', ['$q', 'websocketCore', 'clientFactory','$timeout', function ($q, websocketCore, clientFactory,$timeout) {
    //'use strict';
    var fac = {};

    //The underlying socket 
    var _sflSocket = websocketCore;

    // The tenant ID of the user whos leagues we are fetching
    fac.tenantID;

    //The user ID of the user whos leagues we are fetching
    fac.userID;

    //Returns the indexes of each fantasy league in the array
    var fantasyLeaguesIndexes = {};


    //$timeout(function () {
    //    //Injects the code into the lobby (Should only be used there)
    //    var el = $('#lobbyTable')
    //    el.parent().parent().append("<div  class='panel panel-default' style='position:fixed;left:1em;top:2em'><div class='panel-heading'>Test Lobby Refresher</div> <button onclick='testRefresh()'>Full refresh</button><div class='panel-body' id='testlobbyrefresh'></div><div id='testlobbyrefreshtable'></div></div>");
        
    //    var testDiv = $('#testlobbyrefresh');
    //    var testDivTable = $('#testlobbyrefreshtable');
    //    el.on('mouseover', 'tr', function (element) {
    //        testDiv.empty();
    //        testDivTable.empty();
    //        var id = $(this).prop('id');
    //        testDiv.append('Focused Id: <span>' + id + '</span>')
    //        testDiv.append('<br>');
    //        testDivTable.append('<table style="background-color:grey" id="testlobbyrefreshtableinner" class="table">');
    //        var table = $('#testlobbyrefreshtableinner');
    //        table.append('<thead><tr><th>Property</th><th>Current Value</th><th>New Value</th></tr></thead>')
    //        table.append('<tbody id="testlobbyrefreshbody"></tbody>');
    //        var body = $('#testlobbyrefreshbody');

    //        var fantasyLeague = fac.fantasyLeagues[fantasyLeaguesIndexes[id]];
    //        //Num Players
    //        body.append('<tr><td><b>currentNumberPlayers</b></td><td>' + fantasyLeague.currentNumberPlayers + '</td><td><input></input></td><tr>')
    //        //Status ID
    //        body.append('<tr><td><b>fantasyLeagueStatusID</b></td><td>' + fantasyLeague.fantasyLeagueStatusID + '</td><td><input></input></td><tr>')

           
    //        testDiv.append('</table>')
    //    })
    //    FlowerCityGaming.V1.logMessage(el.find('tr'));
    //})


    

    //The list of fantasy league data umodified by clients
    fac.fantasyLeagues = [];

    /*
     * Function to be called when we receive a message that the entire lobby needs to update. The client passes this is via the 
     * GetAllOpenLeagues function. The callback the user passes in needs to accept a list of fantasy leageus as a parameter.
     */

    fac.fullDataChange;

    /*
     * Function to be called when we receive a message that fantasy league(s) have changed and the lobby needs to be updated. The client passes this in
     * via the getAllOpenLeagues function. The callback the user passes in needs to accept a list of type 'fantasyLeagueDiff' which represent the changes.
     */
    fac.onUpdate;



    /*
     * Takes in an old object, a new object, and a property
     * 
     * Returns: Undefined if there are no differences between the two objects (determined by comparing the property)
     *          A diff containg the property name, flid, the old value, and the new value.
     * 
     * If the property and oldObj are undefined. Then the diff returned will have property name FantasyLeague. Meaning that this is a new 
     * fantasy league.
     */
    getDiff = function (oldObj, newObj, prop) {
        var diff = undefined;
        var oldVal;
        var newVal;

        //Make sure user passed in valid arguments
        if (typeof prop !== 'undefined') {
            oldVal = oldObj[prop];
            newVal = newObj[prop];
        } else if (typeof newObj !== 'undefined' && typeof oldObj === 'undefined') {
            oldVal = oldObj;
            newVal = newObj;
        } else {
            throw new "Arguments are invalid, either all objects must have values. Or prop and newObj must be undefined";
        }

        if (oldVal !== newVal) {
            diff = new fantasyLeagueDiff(newObj.fantasyLeagueID, prop, oldVal, newVal);
        }
        return diff;
    };

    /*
     * Takes in an array of fantasy league IDS and calculates what has changed in them
     */
    calcDiffs = function(flids,overideFLresults) {
        var deffered = $q.defer();
        var diffs = [];
        var numComplete = 0;
        for (var x = 0; x < flids.length; x++) {
            //User our list of fantasyleagues and the dictionary that maps fantasyleagues -> indexes. To get the next fantasy league.
            var nextID = flids[x];
            var index = fantasyLeaguesIndexes[nextID];
            var nextFL = fac.fantasyLeagues[index];

            //Make an api call to get the fantasy league information
            clientFactory.fantasyLeagues().GetFantasyLeagueByID(nextID)
            .then(function (data) {
                //overide data for the passed in data 
                data = overideFLresults;
                //If undefined, this a new fantasy league. The only diff will be the fantasy league itself
                if (typeof nextFL === 'undefined') {
                    //Add the new fantasy league to our list of fl's and store its index.
                    fac.fantasyLeagues.push(data);
                    fantasyLeaguesIndexes[data.fantasyLeagueID] = fac.fantasyLeagues.length - 1;
                    diffs.push(getDiff(nextFL, data));
                }
                else {
                    //Store the new data and calculate the diffs
                    fac.fantasyLeagues[index] = data;
                    diffs.push(getDiff(nextFL, data, 'currentNumberPlayers'));
                    diffs.push(getDiff(nextFL, data, 'fantasyLeagueStatusID'))
                    diffs = diffs.filter(Boolean);
                }

                //Determine if this is the last fantasy league and resolve the promise if so.
                numComplete++;
                if (numComplete == flids.length) {
                    deffered.resolve(diffs);
                }
            });
        }
        return deffered.promise;
    }


   // /*
   //  * Bind to the socket server 'lobbymessage' which tells us when fantasy leagues have changed, and determine
   //  * what has changed about the fantasy leagues the socket server sent us. Then call the client defined function
   //  * when fantasy leagues change.
   //  * Args will be a list of fantasy leagues ex. [1234,23423]
   //  */
   // _sflSocket.bind("lobbymessage", function (args) {
   //
   //     calcDiffs(args.FLIDS).then(function (diffs) {
   //         if (typeof fac.onUpdate === 'function') {
   //             fac.onUpdate(diffs);
   //         }
   //     });
   // }, false);
   //
   // /*
   //  * Bind to the 'LobbyFullUpdate' message sent fromt he socket server when we need to fully refresh the lobby details.
   //  */
   // _sflSocket.bind('LobbyFullUpdate', function (args) {
   //     if (args == 'full') {
   //         fac.getAllOpenLeagues(fac.tenantID, fac.userID, fac.onUpdate, fac.fullDataChange);
   //     }
    // }, false)


    //Note this should mirror the real lobby refreshers _sflSocket.bind('lobbymessage') call
    fac.triggerLobbyMessage = function(flid,overideFlData){
        calcDiffs([flid], overideFlData).then(function (diffs) {
            if (typeof fac.onUpdate === 'function') {
                fac.onUpdate(diffs);
            }
        })
    }

    //Note this should mirror the real lobby refreshers _sflSocket.bind('lobbyFullUpdate') call
    fac.triggerFullUpdate = function(){
        fac.getAllOpenLeagues(fac.tenantID,fac.userID,fac.onUpdate,fac.fullDataChange)
    }
    /*
     * Returns a promise containing all open leagues for this particular user and tenant combo.
     * 
     * Once this method is called the service will start listening for changing fantasy leagues via the socket server. When a change is found,
     * it will call the callbacks specefied by the user.
     * 
     * TenantID         - The tenant the client belongs to.
     * UserID           - The UserID the client belongs to.
     * updatedCallBack  - User defined callback to be called when a fantasy league changes
     * fullDataChange   - User defined callback to be called when the entire lobby needs to be refreshed
     */
    fac.getAllOpenLeagues = function (tenantID, userID, updatedCallback, fullDataChange) {
        fac.tenantID = tenantID;
        fac.userID = userID;
        fac.onUpdate = updatedCallback;
        fac.fullDataChange = fullDataChange;

        var deffered = $q.defer();
        clientFactory.fantasyLeagues().GetOpenFantasyLeagues(tenantID, userID, null, null, null, null).then(function (data) {
            //After fetching all fantasy league data store their data and indexes.
            fac.fantasyLeagues = data;
            fantasyLeaguesIndexes = {};
            for (var x = 0 ; x < fac.fantasyLeagues.length; x++) {
                fantasyLeaguesIndexes[fac.fantasyLeagues[x].fantasyLeagueID] = x;
            }

            //Call the user defined callback when the entire lobby needs to be refreshed.
            fac.fullDataChange(angular.copy(fac.fantasyLeagues));
        });
        return deffered.promise;
    };
    return fac;
}]);


lobbyModule.directive('lobbyRefresherTester', ['lobbyRefresher','$timeout',function (lobbyRefresher,$timeout) {
    directive = {};
    directive.scope = {
        fantasyLeagues :'='
    }
    directive.link = function(scope,element,attrs){
        scope.focusedIndex = null;
        scope.focusedFantasyLeague = null;
        scope.updateIn = 1;
        scope.testRefresh = function()
        {
            $timeout(function()
            {
                lobbyRefresher.triggerFullUpdate();
            },scope.updateIn * 1000);
     
        }
        scope.updateFantasyLeague = function()
        {
            $timeout(function () {
                lobbyRefresher.triggerLobbyMessage(scope.focusedFantasyLeague.fantasyLeagueID, scope.focusedFantasyLeague);

            }, scope.updateIn * 1000)
     
        }
        scope.props = ["fantasyLeagueStatusID","currentNumberPlayers"]
        $('#lobbyTable').on('mouseover', 'tr', function (element) {
            scope.focusedIndex = Number.parseInt($(this).attr('flindex'));
            scope.focusedFantasyLeague = angular.copy(scope.fantasyLeagues[scope.focusedIndex]);
            scope.$apply();
        });



    }
    directive.templateUrl = 'app/shared/services/fantasyLeagues/lobbyRefresher/lobbyRefresherTesterView.html'
    return directive
}])