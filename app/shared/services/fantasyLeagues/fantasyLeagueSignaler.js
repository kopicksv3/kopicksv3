var lobbyModule = angular.module('fantasyLeagueServices', []);

/*
 * Handles sending a message to the websocket serve that a particular fantasy league has changed.
 */
lobbyModule.factory('fantasyLeagueSignaler', ['websocketCore', function (websocketCore) {
    //'use strict';
    var fac = {};
    var _socket = websocketCore;

    /*
     * This returns the argument you need to send to the websocket service.To inform all other clients that 
     * a fantasy league has changed
     */
    var getUpdateMessageParam = function (uid, flid) {
        return JSON.stringify({
            FLID: flid,
            actiontype: "LOBBY",
            userid: uid
        });
    };

    /*
     * Sends a message to the websocket server that a fantasy league has changed.
     */
    fac.sendLeagueChangedMessage = function (userID, flid) {
        var msg = getUpdateMessageParam(userID, flid);
        _socket.send('ClientLeagueUpdateMessage', msg, function (m) { });
    };

    return fac;
}]);