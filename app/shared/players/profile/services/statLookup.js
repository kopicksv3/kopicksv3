var profileStatsHeaderDirectives = angular.module('profileStatsHeaderDirectives');


/*Since our profile stat api calls come back with various different fields depending on sport and player id
 *
 * You can use this service to lookup what the needed field is based on a given alias
 *
 *
 */
profileStatsHeaderDirectives.factory('statLookup', ['$filter',function ($filter) {
    //'use strict';
    var service = {};

    var nflAlias = {
        'SCORE': '(object.teamScore + "-" + object.opponentTeamScore)',
        'WINORLOSS': 'object.teamScore > object.opponentTeamScore ? "W" : "L"',
        'infoTitle': '$filter("uppercase")(object.informationTitle)',
        'FP': "object.fantasyPoints",
        'FPPG': "(object.fantasyPoints === null || object.fantasyPoints === '') ? '-' : $filter('number')(object.fantasyPoints,2)",
        'GP': "object.gamesPlayed",
        'CMP': "object.completions",
        'FUM': "object.fumbles",
        'TPC': "object.twoPointConversions",
        'FLST': 'object.fumblesLost',
        'SSN': 'object.season',
        'gameDate': '$filter("date")(object.gameDate,"M/d")',
        'BOSTATS': '(object.gameDate ? ("LAST GAME (" + $filter("date")(object.gameDate,"M/d") + ")") : "SEASON")',
        /*Passing*/
        'PATT': "object.passing_Attempts",
        'PYDS': "object.passing_Yards",
        'CMP%': "$filter('number')(object.passing_CompletionPercentage,1)",
        'PAVG': "$filter('number')(object.passing_AverageYardsPerCompletion,1)",
        'PTD': "object.passing_Touchdown",
        'INT': "object.interceptions",
        'PRAT': "$filter('number')(object.passing_Rating,1)",
        /*Rushing*/
        'LNG': "object.rushing_LongestRush",
        'RAT': "object.rushing_Attempts",
        'RYDS': "object.rushing_Yards",
        'RAVG': "$filter('number')(object.rushing_AverageYardsPerCompletion,1)",
        'RA': "$filter('number')(object.rushing_Average,1)",
        'RLNG': "object.rushing_LongestRush",
        'RUTD': "'rushing_TouchDowns' in object ? object.rushing_TouchDowns : object.rushing_Touchdown ",
        'RYPG': "$filter('number')(object.rushing_YardsPerGame,1)",
        'RUYDS': "object.rushing_Yards",
        'RUYPG': "$filter('number')(object.rushing_YardsPerGame,1)",
        'RULR': 'object.rushing_LongestRush',
        'RUAVG': "$filter('number')(object.rushing_Average,1)",
        /*Receiving*/
        'RETD': "object.receiving_Touchdowns",
        'REC': "object.receptions",
        'REYDS': "object.receiving_Yards",

        'REL': 'object.receiving_Longest',
        'REAVG': "$filter('number')(object.receiving_Average,1)",
        'REYPG': 'object.receiving_YardsPerGame'
    };
    var mlbAlias = {
        /*Pithers*/
        'GS': 'object.gamesStarted',
        'W': 'object.wins',
        'L': 'object.losses',
        'S': 'object.saves',
        'IP': 'object.inningsPitched',
        'HA': 'object.hitsAgainst',
        'R': 'object.runs',
        'ER': 'object.earnedRuns',
        'HR': 'object.homeRuns',
        'SO': 'object.strikeouts',
        'BB': 'object.walks',
        'CG': 'object.completeGames',
        'SHO': 'object.shutouts',
        'ERA': '$filter("number")(object.earnedRunAverage,2)',
        'WHIP': '$filter("number")(object.walksAndHitsPerInning,2)',
        'BAA': '$filter("number")(object.battingAverageAgainst,2)',
        'infoTitle': 'object.informationTitle',

        /*Everything Else*/
        'gameDate': '$filter("date")(object.gameDate,"M/d")',
        'GAMES': 'object.games',
        'FP': 'object.fantasyPoints',
        'FPPG': "(object.fantasyPoints === null || object.fantasyPoints === '') ? '-' : $filter('number')(object.fantasyPoints,2)",
        'AB': 'object.atBats',
        'H': 'object.hits',
        'R': 'object.runs',
        'HR': 'object.homeRuns',
        'RBI': 'object.runsBattedIn',
        'D': 'object.doubles',
        'T': 'object.triples',
        'BB': 'object.walks',
        'KO': 'object.strikeouts',
        'SB': 'object.stolenBases',
        'CS': 'object.caughtStealing',
        'SAC': 'object.sacrificeFlies',
        'AVG': '$filter("number")(object.battingAverage,3)',
        'OBP': '$filter("number")(object.onBasePercentage,3)',
        'SLG': '$filter("number")(object.sluggingPercentage,3)',
        'OPS': '$filter("number")(object.onBasePlusSluggingPercentage,3)'
    };

    var nhlAlias = {
        'gameDate': '$filter("date")(object.gameDate,"M/d")',
        'infoTitle': '$filter("uppercase")(object.informationTitle)',
        'GP': '(object.gamesPlayed)',
        'FPPG': "(object.fantasyPoints === null || object.fantasyPoints === '') ? '-' : $filter('number')(object.fantasyPoints,2)",
        'G': '(object.goals)',
        'A': '(object.assists)',
        'PTS': '(object.points)',
        '+/-': '(object.plusMinus)',
        'SOG': '(object.shotsOnGoal)',
        '%': "$filter('number')((object.shootingPercentage * 100), 2)",
        'PPG': '(object.powerPlayGoals)',
        'PPA': '(object.powerPlayAssists)',
        'SHG': '(object.shorthandedGoals)',
        'SHA': '(object.shorthandedAssists)',
        'BS': '(object.blockedShots)',
        'HITS': '(object.hits)',
        'FOW%': '$filter("number")(object.faceoffWinningPercentage, 2)',
        'OPP': '(object.informationTitle  + " (" + LookupDecision(object.decision,object.wins,object.losses) + ")" )',
        'OPPSkater': '$filter("uppercase")(object.informationTitle  + " (" + LookupDecision(object.decision,"","", object.teamScore, object.opponentTeamScore) + ")" )',
        'SCORE': '(object.teamScore + "-" + object.opponentTeamScore)',
        'DEC': 'LookupDecision(object.decision,object.wins,object.losses)',
        'WINS': '(object.wins)',
        'LOSSES': '(object.losses)',
        'OTL': '(object.overtimeLoss)',
        'PIM': '(object.penaltyMinutes)',
        'ENGA': '(object.emptyNetGoalsAgainst)',
        'GS': '(object.gamesStarted)',
        'TOI': 'CalcTOI(object.timeOnIce)',
        'OPTID': '(object.opTeamID)',
        'GA': '(object.goalsAgainst)',
        'SA': '(object.shotsAgainst)',
        'SV': '(object.saves)',
        'SV%': '$filter("number")(object.savePercentage * 100, 2)',
        'GAA': '$filter("number")(object.goalsAgainstAverage, 2)',
        'SO': '(object.shutout)'
    };

    var nbaAlias = {
        'infoTitle': '$filter("uppercase")(object.informationTitle)',
        'label': '(object.label)',
        'GP': '(object.gamesPlayed)',
        'gameDate': '$filter("date")(object.gameDate,"M/d")',
        'FPPG': "(object.fantasyPoints === null || object.fantasyPoints === '') ? '-' : $filter('number')(object.fantasyPoints,2)",
        'OPP': '(object.informationTitle  + " (" + LookupDecision(object.decision,"","", object.teamScore, object.opponentTeamScore) + ")" )',
        'SCORE': '(object.teamScore + "-" + object.opponentTeamScore)',
        'PTS': "$filter('number')(object.points,1)",
        'AST': "$filter('number')(object.assists,1)",
        'REB': "$filter('number')(object.rebounds,1)",
        'STL': "$filter('number')(object.steals,1)",
        'BLK': "$filter('number')(object.blocks,2)",
        'TO': "$filter('number')(object.turnovers,1)",
        'FGM': "$filter('number')(object.fieldGoalsMade,1)",
        'FGA': "$filter('number')(object.fieldGoalsAttempted,1)",
        'FTM': "$filter('number')(object.freeThrowsMade,1)",
        'FTA': "$filter('number')(object.freeThrowsAttempted,1)",
        '3PM': "$filter('number')(object.threePointersMade,1)",
        '3PA': "$filter('number')(object.threePointersAttempted,1)",
        'PF': "$filter('number')(object.personalFouls,1)",
        'FG%': "$filter('number')(object.fieldGoalPercentage,2)",
        'FT%': "$filter('number')(object.freeThrowPercentage,2)",
        '3P%': "$filter('number')(object.threePointersPercentage,2)",
        'MIN': "$filter('number')(object.minutesPlayed,1)"
    };

    /*
     * Lookup NHL decision
     */
    var LookupDecision = function(decision,wins,losses, teamScore, oppTeamScore){

        if (wins == '' && losses == '' && decision == null) {
            if (teamScore > oppTeamScore)
                return 'W';
            else if (oppTeamScore > teamScore)
                return 'L';
        }

        if (typeof decision == 'undefined')
            return '-';
        if (decision == '-')
            return '-';
        switch(decision.toUpperCase()){
            case 'WIN':
                return 'W';
            case 'LOSS':
                return 'L';
            case 'OT LOSS':
                return 'OTL';
            case 'OT WIN':
                return 'OTW';
            case 'NO DECISION':
                if (wins === 1)
                    return 'W';
                else if (losses === 1)
                    return 'L'
                return 'ND';
        }
    }
    /*
     * Calculate TOI (time on ice) for NHL
     * mm.ss
     * mm = minutes
     * ss = fractional minutes (must multiply by 60 and add to minutes)
     */
    var CalcTOI = function (time) {
        if (time == "-") {
            return time;
        }
        var minutes = Math.floor(time);
        var seconds = (time - minutes);
        seconds = (60 * (seconds)).toFixed(0);
        minutes = pad(minutes, 2);
        seconds = pad(seconds, 2);
        return (minutes + ":" + seconds);
    }

    function pad(num, size) {
        var s = String(num);
        while (s.length < size) {
            s = "0" + s;
        }
        return s;
    }


    /*
     * Object - An object containing the players statistics
     * Alias - The alias of the stat
     * Sport - The Sport ID
     * pos   - The position ID
     */
    service.getStat = function (object,alias,sport)
    {
        var sportObj  = {};
        if (typeof object === 'undefined')
            return;
        switch (sport)
        {
            case FlowerCityGaming.V1.Constants.Sports.FOOTBALL:
                sportObj = nflAlias;
                break;
            case FlowerCityGaming.V1.Constants.Sports.BASEBALL:
                sportObj = mlbAlias;
                break;
            case FlowerCityGaming.V1.Constants.Sports.HOCKEY:
                sportObj = nhlAlias;
                break;
            case FlowerCityGaming.V1.Constants.Sports.BASKETBALL:
                sportObj = nbaAlias;
                break;
            case FlowerCityGaming.V1.Constants.Sports.BASEBALL:
                sportObj = mlbAlias
                break;
        }

        return eval(sportObj[alias]);
    }
    //return the given prop of an object
    service.getObjectProp = function(object,prop)
    {
        return object[prop];
    }
    return service;
}])
