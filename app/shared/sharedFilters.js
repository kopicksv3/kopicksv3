var sharedFilters = angular.module("SharedFilters", []);

sharedFilters.filter('entryFeeTicketFilter', ['$filter', function ($filter) {
    //'use strict';
    return function (entryfee, ticket) {

        if (ticket) {
            return 'Ticket';
        }
        else if (entryfee == 0) {
            return 'FREE';
        }
        return $filter('currency')(entryfee, '$', 0);
    };
}]);

sharedFilters.filter('getPrizeFilter', ['$filter', function ($filter) {
    //'use strict';
    return function (prizePool, payoutCurrencyType) {
        //need to replace with tenant point systems
        if (payoutCurrencyType == FlowerCityGaming.V1.Constants.CURRENCY_SFP) {
            return prizePool + ' POINTS';
        }
        else {
            if (prizePool % 1 != 0)
                return $filter('currency')(prizePool, '$', 2);
            else
                return $filter('currency')(prizePool, '$', 0);
        }
    };
}]);

sharedFilters.filter('currencyString',function(){
    return function(currencyID)
    {
        switch (currencyID) {
            case (1):
                return "BC";
                break;
            case (2):
                return "SPs";
                break;
            case (3):
                return "USD"
                break;
            default:
                return "";
        }
    }
});


sharedFilters.filter('getLeagueStr', function () {
    return function (leagueid) {        
        return FlowerCityGaming.V1.Constants.Leagues[leagueid];
    }
});
sharedFilters.filter('getDraftStyleStr', ['$filter', function ($filter) {
    return function (draftstyleid) {
        return $filter('capitalize') (FlowerCityGaming.V1.Constants.FantasyLeagueDraftStyleID[draftstyleid]);
    }
}]);
sharedFilters.filter('getDurationStr', ['$filter', function ($filter) {
    return function (durid) {
        return $filter('capitalize')(FlowerCityGaming.V1.Constants.FantasyLeagueDurationID[durid]);
    }
}]);
sharedFilters.filter('getBettingStr', function () {
    return function (betid) {
        var val = FlowerCityGaming.V1.Constants.FantasyLeagueBettingStyleID[betid];
        if (val == 'STANDARD')
            return 'Standard';
        if (val == 'DOUBLEUP')
            return 'Double-Up';
        if (val == 'WINNERTAKEALL')
            return 'Winner-Take-All';
        if (val == 'TOP3')
            return 'Top-3';
        if (val == 'TOP20PERCENT')
            return 'Top-20%';
        if (val == 'TRIPLEUP')
            return 'Triple-Up';
    }
});
sharedFilters.filter('getStatusStr', ['$filter', function ($filter) {
    return function (statusid) {
        return $filter('capitalize')(FlowerCityGaming.V1.Constants.FantasyLeagueStatusID[statusid]);
    }
}]);
sharedFilters.filter('getPrivateStr', ['$filter', function ($filter) {
    return function (isPrivate) {
        return isPrivate?'Private':'Public';
    }
}]);

sharedFilters.filter('capitalize', function () {
  return function (input, scope) {
    if(input!= null)
    input = input.toLowerCase();
    return input.substring(0, 1).toUpperCase() +input.substring(1);
    }
});

sharedFilters.filter('getGuaranteedIcon', ['$sce', function ($sce) {
    return function (guaranteed) {
        if (guaranteed) {
            return $sce.trustAsHtml('<button type="button" class="btn btn-key btn-key-sm btn-gl" data-toggle="tooltip" data-placement="top" title="Guaranteed League">G</button>');
        }
        return '';
    }
}]);

sharedFilters.filter('getLeagueIcon', ['$sce', function ($sce) {
    return function (leagueID) {
        return $sce.trustAsHtml('<button type="button" class="btn btn-k')
    }

}]);

sharedFilters.filter('getMultiIconFilter', ['$sce', function ($sce) {
    return function (multi) {
        if (multi > 1) {
            return $sce.trustAsHtml('<button type="button" class="btn btn-key btn-key-sm btn-me" data-toggle="tooltip" data-placement="top" title="Multi-Entry">M</button>');
        }
        return '';
    }
}]);

sharedFilters.filter('getH2HIconFilter', ['$sce', function ($sce) {
    return function (maxPlayers) {
        if (maxPlayers == 2) {
            return $sce.trustAsHtml('<button type="button" class="btn btn-key btn-key-sm btn-hu" data-toggle="tooltip" data-placement="top" title="Heads Up">H</button>');
        }
        return '';
    }
}]);

sharedFilters.filter('getBettingStyleIconFilter', ['$sce', function ($sce) {
    return function (betid) {
        if (betid == 2) {
            return $sce.trustAsHtml('<button type="button" class="btn btn-key btn-key-sm btn-dup" data-toggle="tooltip" data-placement="top" title="Double-Up Payout">2<sub>x</sub></button>');
        }
        else if (betid == 3) {
            return $sce.trustAsHtml('<button type="button" class="btn btn-key btn-key-sm btn-wta" data-toggle="tooltip" data-placement="top" title="Winner Take All">W</button>');
        }
        else if (betid == 6) {
            return $sce.trustAsHtml('<button type="button" class="btn btn-key btn-key-sm btn-tup" data-toggle="tooltip" data-placement="top" title="Triple-Up Payout">3<sub>x</sub></button>');
        }
        return '';
    }
}]);

sharedFilters.filter('getTurboIconFilter', ['$sce', function ($sce) {
    return function (draftstyleid) {
        if (draftstyleid == FlowerCityGaming.V1.Constants.FantasyLeagueDraftStyleID["TURBO"]) {
            return $sce.trustAsHtml('<button type="button" class="btn btn-key btn-key-sm btn-turbo" data-toggle="tooltip" data-placement="top" title="Turbo">T</button>');
        }
        return '';
    }
}]);

sharedFilters.filter('getQualIconFilter', ['$sce', function ($sce) {
    return function (isQualifier) {
        if (isQualifier) {
            return $sce.trustAsHtml('<button type="button" class="btn btn-key btn-key-sm btn-qualifier" data-toggle="tooltip" data-placement="top" title="Qualifier">Q</button>');
        }
        return '';
    }
}]);

sharedFilters.filter('getSatIconFilter', ['$sce', function ($sce) {
    return function (isSatellite) {
        if (isSatellite) {
            return $sce.trustAsHtml('<button type="button" class="btn btn-key btn-key-sm btn-satellite" data-toggle="tooltip" data-placement="top" title="Satellite">S</button>');
        }
        return '';
    }
}]);

sharedFilters.filter('sportIcon', ['$sce', function ($sce) {
    return function (sportID) {
        var spriteIconName;
        switch (sportID) {
            case (1):
                spriteIconName = 'nfl'
                break;
            case (2):
                spriteIconName = 'mlb'
                break;
            case (3):
                spriteIconName = 'nba'
                break;
            default:

        }
        return spriteIconName;
    }

}]);

//Formats Date and Time with moment.js 
//Please use http://momentjs.com/docs/#/parsing/string-format/ to figure out the correct format. i.e. 'MM/DD/YYYY'
sharedFilters.filter('formatDateTime', ['$sce', function ($sce) {
    return function (mstime, formatInput) {
        return moment(mstime).format(formatInput);
    }
}])

sharedFilters.filter('dateDiffInDays', ['$sce', '$filter', function ($sce, $filter) {
    return function (mstime) {
        var scoringstart = moment(mstime);
        var now = moment();
        var formattedDateTime;

        var diffInDays = scoringstart.diff(now, 'days');
        return diffInDays;
    }

}]);


//GetCountDown
//This function will return 

sharedFilters.filter('getCountDown', ['$filter', '$sce', function ( $filter, $sce) {
    return function (mstime) {
        var scoringstart = moment(mstime);
        var now = moment();
        var formattedDateTime;

        var diffInDays = scoringstart.diff(now, 'days');

        //if more than 7 days away M/D h:mm a
        if (diffInDays >= 7) {
            return $filter('formatDateTime')(scoringstart, 'M/D h:mm a');
        }

        else if (diffInDays < 7 && diffInDays > 0) {
            return $filter('formatDateTime')(scoringstart, 'ddd h:mm a');
        }
        return '';
    }
}]);

sharedFilters.filter('toDecimal', function () {
    return function (int) {
        if (typeof int == "undefined") {
            return 0.00;
        }
        else return int.toFixed(2);
    }
});

sharedFilters.filter('defaultZero', function () {
    return function (num) {
        if (typeof num == "undefined" || num == null) {
            return 0;
        }
        else
            return num;
    }
});

sharedFilters.filter('defaultZero', function () {
    return function (num) {
        if (typeof num == "undefined" || num == null) {
            return 0;
        }
        else
            return num;
    }
});

sharedFilters.filter('toInt', function () {
    return function (decimal) {
        if (typeof decimal == "undefined") {
            return 0;
        }
        else return Math.round(decimal);
    }
});


sharedFilters.filter('undefinedZero', function () {
    return function (isUndefined) {
        if (typeof isUndefined == "undefined") {
            return "-";
        }
        else return isUndefined;
    }
});

//returns salary cap as $[salamount]K i.e. $100K (usually)
sharedFilters.filter('salCapInK', function () {
    return function (salCap) {
        if (salCap)
            return "$" + salCap/1000 + "K";

        return salCap;
    }
});

sharedFilters.filter('getPrizeWithCurr', ['$filter', function ($filter) {
    return function (prizeval, currid, tenPoints) {
        if (currid == FlowerCityGaming.V1.Constants.CURRENCY_USD) {
            return $filter('currency')(prizeval, '$', 2)
        }
        else if (currid == FlowerCityGaming.V1.Constants.CURRENCY_SFP) {
            return prizeval + ' ' + tenPoints;
        }
        return prizeval + ' ' + currid;
    }
}]);

sharedFilters.filter('getPrize', ['$filter', function ($filter) {
    return function (prizeval, payoutCurrencyType, tenPoints) {
        if (payoutCurrencyType == FlowerCityGaming.V1.Constants.CURRENCY_USD) {
            return $filter('currency')(prizeval, '$', 0)
        }
        else {
            return prizeval + ' ' + tenPoints;
        }
        return prizeval;
    }
}]);

sharedFilters.filter('getSubstring', function () {
    return function (text, numChars) {
        return text.substring(0, numChars);
    }
});

/**
 * Filters out all duplicate items from an array by checking the specified key
 * @param [key] {string} the name of the attribute of each object to compare for uniqueness
 if the key is empty, the entire object will be compared
 if the key === false then no filtering will be performed
 * @return {array}
 */
sharedFilters.filter('unique', function () {

    return function (items, filterOn) {

        if (filterOn === false) {
            return items;
        }

        if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
            var hashCheck = {}, newItems = [];

            var extractValueToCompare = function (item) {
                if (angular.isObject(item) && angular.isString(filterOn)) {
                    return item[filterOn];
                } else {
                    return item;
                }
            };

            angular.forEach(items, function (item) {
                var valueToCheck, isDuplicate = false;

                for (var i = 0; i < newItems.length; i++) {
                    if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
                        isDuplicate = true;
                        break;
                    }
                }
                if (!isDuplicate) {
                    newItems.push(item);
                }

            });
            items = newItems;
        }
        return items;
    };
});

/*
 * Working to eventually deprecate this method and work it into a service
 */
sharedFilters.filter('getLeagueName', ['$filter', '$sce', function ($filter, $sce) {
    return function (name, entryFee, ticket, prizepool, payoutCurrencyType, numPlayers, h2hUser, h2hFields, betid, qual, multiEntries) {
        var newName = '';
        if (name) {
            newName = name;
        }
        else {
            //Entry Fee
            if (!ticket) {
                if (entryFee > 0)
                    newName = newName + '$' + entryFee + ' - ';
                else
                    newName = newName + 'FREE' + ' - ';
            }

            //Prize Pool
            newName = newName + $filter('getPrizeFilter')(prizepool, payoutCurrencyType) + ' ';

            //Max Number of Players
            if (numPlayers) {
                //HEAD TO HEAD
                if (numPlayers == 2) {
                    newName = newName + 'H2H ';
                    if (h2hUser) {
                        newName = newName + 'vs. ' + h2hUser + ' ';
                    }
                    //should this be and instead of or?
                    if (h2hFields || h2hFields > 1) {
                        newName = newName + '{ x ' + h2hFields + ' } ';
                    }
                }

                if (numPlayers > 2) {
                    newName = newName + numPlayers + '-Man ';

                    //Qualifier
                    if (qual) {
                        newName = newName + ' Qualifier ';
                    }

                    //Betting Style
                    newName = newName + $filter('getBettingStr')(betid);
                }
            }

        }
        //Multi Entry
        if (multiEntries > 1) {
            newName = newName + ' (Multi-Entry) ';
        }

        return newName;
    }
}]);


sharedFilters.filter('numPlayersFilter', ['$filter', function ($filter) {
    return function (numPlayers, maxPlayers) {
        if (maxPlayers) {
            return numPlayers + '/' + maxPlayers;
        }
        else
            return numPlayers;
    }
}]);

sharedFilters.filter('battingAverage', [function () {
    return function (average) {
        var values = average.split('.');
        FlowerCityGaming.V1.logMessage(values);
        return '.' + values[1];
    }
}]);
