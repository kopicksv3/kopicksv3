//'use strict'
var errorMessages = angular.module('errorMessages', ['genericModalService']);

errorMessages.factory('errorFactory', ['GenericModal', function (GenericModal) {
    /* List of errors copied over from*/
    var _errors = {
        "AlreadyJoined": "You have already joined this Fantasy League.",        
        "CannotJoinBecauseCategoryRestriction": "You cannot join any more fantasy leagues of this type.",
        "CannotJoinWithCashOrPoints": "This fantasy league cannot be joined with cash or points.",
        "ExceededTryCount": "There was an error processing your request. Please contact support for more information.",
        "GeneralFailure": "There was an error processing your request. Please contact support for more information.",    
        "InappropriateFantasyLeagueName": "No profanity is allowed in the Fantasy League Name",
        "IncorrectPassword": "The password you have entered is incorrect.",
        "InsufficientCash": "You do not have enough money to join this Fantasy League.",
        "InsufficientPoints": "You do not have enough points to join this Fantasy League.",        
        "InvalidFantasyLeagueId": "There was an error processing your request. Please contact support for more information.",
        "InvalidFantasyLeagueNameCharacters": "The Fantasy League Name must contain only letters, numbers, and spaces.",
        "InvalidFantasyLeagueNameMaximumLength": "The Fantasy League Name cannot be more than 27 letters.",
        "InvalidFantasyLeagueNameMinimumLength": "The Fantasy League Name must be at least 4 letters.",
        "JoinedMaximum": "You have reached the maximum number of entires for this Fantasy League.",
        "LeagueClosed": "The Fantasy League has already been filled.",
        "NotAuthorizedForCashGames": "You are currently not eligible to playin  cash Fantasy Leagues.",
        "TicketInvalid": "The ticket you are using is invalid for this fantasy league.",
        "TicketExpired": "The ticket you are using has expired",
        "TicketAlreadyUsed": "The ticket you are using has already been used.",
        "TooManyFreeLeagues": "You have entered the maximum amount of free leagues.",        
        "UnauthorizedTenant": "There was an error processing your request. Please contact support for more information.",
        "Unknown": "There was an error processing your request. Please contact support for more information.",
        "UserDoesNotExist": "There was an error processing your request. Please contact support for more information."
    };
    // TODO - unsure how to handle these cases
    /*
        //case Constants.JoinFantasyLeagueResultEnum.Success:
        //return "You have successfully join the Fantasy League";
        
      "AlreadyJoinedDifferentTenant":
if (joinResult.AlreadyJoinedTenant == null)
  return "You have already joined this fantasy league with a different account. You can only join a fantasy league with one account.";
else
  return "You have already joined this fantasy league with your " + joinResult.AlreadyJoinedTenant.Name + " account. You can only join a fantasy league with one account.";
  */
    
    var _genericError = "There was an error processing your request. Please contact support for more information.";

    var factory = {};

    factory.getErrorMessage = function ( messageCode) {
        var message = _errors[messageCode];
        if ((typeof message == "undefined") || message == null) {
            message = _genericError;
        }
        return message;
    };

    factory.displayErrors = function (errObj, message) {
        var toShow = "";
        if (message) {
            toShow = message;
        } else {
            // code to deal with the errObj
             message = _errors[errObj.message];
            if ((typeof message == "undefined") || message == null) {
                message = _genericError;
            }
        }

        GenericModal.showModal('Error', message);
    }

    return factory;

}]);