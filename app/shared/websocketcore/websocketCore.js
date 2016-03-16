var sflSockets = angular.module('sflSockets', []);


sflSockets.provider('websocketCore', function () {
    //'use strict';

    //Socket server address, due to how providers work.
    //Meaning we can configure the addr before controller injection.
    var _serverAddress;

    //$get is what will be called  when being injected into controllers
    //All the other methods are available to the module configuration.
    return {

        /*
         * Configures our provider to point to this particular websocket server
         */
        setServerAddress: function (addr) {
            _serverAddress = addr;
        },
        $get: function () {
            /*
             * Exceptions related to the sflSockets
             */
            sflSocketException = function (message) {
                me.message = message;
                me.name = "sflSocketException";
            };


            /*
             * Class returned when getSocket is called. This will be used directly by the user
             * Note: This constructor should never be called directly. Use getSocket instead
             * 
             * addr      - The address of the socket server will listen/send messges to.
             * open      - (Optional) The method to run when opening the connection
             * close     - (Optional) The method to run when closing the socket connection.
             * uid       - Some uniqe id that the server can use to track.
             */
            sflSocket = function (addr, open, close, error,uid) {
                if (typeof addr == 'undefined') {
                    throw new sflSocketException('WebSocket server address was undefined, make sure the sflSockets module is being configured correctly');
                }
                me = this;   // So we dont lose scope in bindings
                me.id = Math.random();

                me._addr = addr;

                me._bindings = {};
                
                me._waitingMessages = [];
                me._challengeSent = false;


                me.challengeToken = JSON.stringify({
                    actiontype: "LOBBY",
                    userid: uid
                });


                /*
                 * Binds the given callback when the supplied message id is sent from the server.
                 */
                me.bindSpeceficID = function (keys, successFunc, failureFunc) {
                    if (successFunc) {
                        me.bind(keys.successKey.toLowerCase(), successFunc);
                    }
                    if (failureFunc) {
                        me.bind(keys.failureKey.toLowerCase(), failureFunc);
                    }
                };

                me.bind = function (messageID, successFunc, unbindAfterFirst) {
                    me._bindings[messageID.toLowerCase()] = function (args) {
                        successFunc(args);
                        if (typeof unbindAfterFirst == 'undefined' || unbindAfterFirst === true) {
                            me.Unbind(messageID);
                        }

                    };
                };


                me.bind("Challenge", function () {
                    me._challengeSent = true;
                    me.send("ChallengeResponse", me.challengeToken);
                },true);
                me._socket = new WebSocket(addr);
                me._socket.onclose = close;
                me._socket.onopen = open;
                me._socket.onerror = error;
                /*
                 * Removes the binding with the supplied id.
                 */
                me.Unbind = function (id) {
                    me._bindings[id.toLowerCase()] = undefined;
                };

                me.sendWait = function (message, callback) {
                    me.waitForConnection(function () {
                        me._socket.send(message);
                        if (typeof callback !== 'undefined') {
                            callback();
                        }
                    }, 1000);
                };

                me.waitForConnection = function (callback, interval) {
                    if (me._socket.readyState === 1 && me._challengeSent) {
                        callback();
                    } else {
                        // optional: implement backoff for interval here
                        setTimeout(function () {
                            me.waitForConnection(callback, interval);
                        }, interval);
                    }
                };

                /*
                 * Creates Uniqe index keys to be sent to the websocket server.
                 * 
                 * Returns-   
                 * {
                 *    key       : The uniqe index key that identifys this request
                 *    success   : A uniqe key that will be sent for success callbacks from the server.
                 *    failure   : A uniqe key that will be sent for failure callbacks from the server
                 *    objMessage: The stringified arguments to the server
                 * }
                 */
                var constructArgs = function (message, args) {
                    //In theroy should be uniqe.
                    var key = message + '.' + Math.random();

                    var objMessage = {
                        Message: message,
                        Args: args,
                        ResponseKey: key
                    };

                    // jsonify arguments if necessary
                    if (objMessage.Args && typeof objMessage.Args === "object")
                        objMessage.Args = JSON.stringify(objMessage.Args);

                    //This is whats sent to the server
                    return {
                        keys: {
                            id: key,
                            successKey: key + '.success',
                            failureKey: key + '.failure',
                        },
                        objMessage: objMessage
                    }
                }

                /*
                 * Sends a websocket message to the server.
                 * 
                 * Message - The 
                 */
                me.send = function (message, args, successFunc, failureFunc) {

                    if (successFunc && typeof successFunc !== 'function') {
                        throw new sflSocketException('send(message,args,success,failure) : success was not a function, passed in type was '
                            + typeof success);
                    }
                    if (failureFunc && typeof failureFunc !== 'function') {
                        throw new sflSocketException('send(message,args,success,failure) : failure was not a function, passed in type was '
                            + typeof failure);
                    }

                    var args = constructArgs(message, args);


                    if (successFunc || failureFunc) {
                        me.bindSpeceficID(args.keys, successFunc, failureFunc);
                    }

                    // send message to server
                    var strMsg = JSON.stringify(args.objMessage);
                    if (me._challengeSent) {
                        me.sendWait(strMsg);
                    }
                    else {
                        me._waitingMessages.push(strMsg)
                    }
                }

                me.runWaiting = function () {

                    while (me._waitingMessages.length !== 0) {
                        //Note that we are calling the inner socket's send not our implementations.
                        me.sendWait(me._waitingMessages.shift());
                    }
                }
                me._socket.onopen = function () {
                    me.runWaiting();
                }
                me._socket.onmessage = function (evt) {
                    var socketMsg = evt.data;
                    var msg = JSON.parse(socketMsg);
                    var lcMessage = msg.Message.toLowerCase();
                    if (msg.Args.length == 1) msg.Args = msg.Args[0];
                    if (typeof me._bindings[lcMessage] === "function")
                        me._bindings[lcMessage](msg.Args);
                }
            }
            return new sflSocket(_serverAddress, null, null, null, 199);
                       
            //return {
               
            //    /*
            //     * Returns a new socket connected to the _serverAddress variable.
            //     * Open  - executed immediatly after the connection is made
            //     * Close - executed after the connection is ended
            //     * Error - executed when an error occours
            //     * Send  - When sending data to 
            //     */
            //    getSocket: function (open, close, error,uid) {
            //        return new sflSocket(_serverAddress, open, close, error,uid);
            //    }
            //}
        }
    }
});
