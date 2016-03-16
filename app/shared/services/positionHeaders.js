var positionHeaders = angular.module('positionHeaders', []);

positionHeaders.factory('leagueHeaders', function () {
    //'use strict';
    var factory = {};

    /*
     * Factory method to return player position headers for NFL
     */
    factory.getNFL = function () {
        var nflPos = [
			{
			    id: "ALL",
			    values: ["QB", "RB", "WR", "TE", "DST"],
			    desc: "ALL Positions",
			    active: true
			},
			{
			    id: "QB",
			    values: ["QB"],
			    desc: "Quarterback",
			    active: false
			},
			{
			    id: "RB",
			    values: ["RB"],
			    desc: "Running Back",
			    active: false
			},
			{
			    id: "WR",
			    values: ["WR"],
			    desc: "Wide Reciever",
			    active: false
			},
			{
			    id: "TE",
			    values: ["TE"],
			    desc: "Tight End"
			},
			{
			    id: "DST",
			    values: ["DST"],
			    desc: "Defensive Team"
			},
			{
			    id: "FLEX",
			    values: ["RB", "WR", "TE"],
			    desc: "FLEX Positions"
			}
        ];
        return nflPos;
    };

    /*
     * Factory method to return player position headers for NFL
     * 
     * @param: isTurbo - determines if turbo game
     */
    factory.getNHL = function (isTurbo) {
        var nhlPos = null;
        if (isTurbo) {
            nhlPos = [
			    {
			        id: "ALL",
			        values: ["LW", "RW", "W", "C", "D", "G"],
			        desc: "ALL Positions",
			        active: true
			    },
			    {
			        id: "F",
			        values: ["LW", "RW", "W", "C"],
			        desc: "Wing",
			        active: false
			    },
			    {
			        id: "D",
			        values: ["D"],
			        desc: "Defense",
			        active: false
			    },
			    {
			        id: "G",
			        values: ["G"],
			        desc: "Goalie",
			        active: false
			    }
            ];
        }
        else {
            nhlPos = [
			    {
			        id: "ALL",
			        values: ["LW", "RW", "W", "C", "D", "G"],
			        desc: "ALL Positions",
			        active: true
			    },
			    {
			        id: "W",
			        values: ["LW", "RW", "W"],
			        desc: "Wing",
			        active: false
			    },
			    {
			        id: "C",
			        values: ["C"],
			        desc: "Center",
			        active: false
			    },
			    {
			        id: "D",
			        values: ["D"],
			        desc: "Defense",
			        active: false
			    },
			    {
			        id: "G",
			        values: ["G"],
			        desc: "Goalie"
			    },
			    {
			        id: "FLEX",
			        values: ["LW", "RW", "W", "C", "D"],
			        desc: "FLEX Positions",
			        active: false
			    }
            ];
        }

        return nhlPos;
    };

    /*
     * Factory method to return player position headers for NBA
     */
    factory.getNBA = function () {
        var nbaPos = [
			    {
			        id: "ALL",
			        values: ["G", "F", "C", "U"],
			        desc: "ALL Positions",
			        active: true
			    },
			    {
			        id: "G",
			        values: ["G"],
			        desc: "Guard",
			        active: false
			    },
			    {
			        id: "F",
			        values: ["F"],
			        desc: "Forward",
			        active: false
			    },
			    {
			        id: "C",
			        values: ["C"],
			        desc: "Center",
			        active: false
			    },
                {
                    id: "U",
                    values: ["G", "F", "C", "U"],
                    desc: "Utility",
                    active: false,
                    hideThis: true
                }

        ];
        return nbaPos;
    };

    factory.getMLB = function () {
        var mlbPos = [
            {
                id: "ALL",
                values: ["P", "SP", "C", "1B", "2B", "3B", "SS", "RP", "U", "IF", "BN"],
                desc:"ALL Positions",
                active:true
            },
            {
                id:"SP",
                values:["SP"],
                desc:"Starting Pitcher",
                active:false
            },
            {
                id:"C",
                values:["C"],
                desc:"Center",
                active:false
            },
            {
                id:"1B",
                values: ["1B"],
                desc:"First Base",
                active:false
            },
            {
                id:"2B",
                values: ["2B"],
                desc:"Second Base",
                active:false
            },
            {
                id:"SS",
                values:["SS"],
                desc:"Short Stop",
                active:false
            },
            {
                id:"3B",
                values: ["3B"],
                desc:"Third Base",
                active:false
            },

            {
                id:"OF",
                values:["OF"],
                desc:"Out Fielder",
                active:false
            },
            {
                id:"U",
                values: ["C", "1B", "2B", "3B", "SS", "RP", "U", "IF", "BN"],
                desc:"Utility",
                active:false
            },

                                                                                  
        ]
        return mlbPos;
    }

    return factory;
});

positionHeaders.service('positionService', ['clientFactory', 'leagueHeaders', function(clientFactory, leagueHeaders){
    //'use strict';
    this.getHeaders = function (leagueID, draftStyle) {        
        var league = FlowerCityGaming.V1.Constants.Leagues[leagueID],
            style = FlowerCityGaming.V1.Constants.FantasyLeagueDraftStyleID[draftStyle] == "TURBO",
            headers = null;
        if (league == "NFL") headers = leagueHeaders.getNFL();
        else if (league == "NBA") headers = leagueHeaders.getNBA();
        else if (league == "NHL") headers = leagueHeaders.getNHL(style);
        else if (league == 'MLB') headers = leagueHeaders.getMLB();
        return headers;
    };
}]);