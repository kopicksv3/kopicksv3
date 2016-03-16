/*
 * This service takes as input a string representing the name of a scoring type for example.
 * "Passing Touchdown","Passing Td", "PasTd","Field Goals"
 * 
 * And converts them to their appropriate abbreviation Ex:
 * "PATD","FG"
 * 
 * This service uses a dictionary of known long names and matches them to the appropriate abbreviation.
 * 
 * If the long name is not in the dictionary it is returned. This may be the case for many of the values since only some of them are
 * invalid
 */

//Add this to the scoring module
var scoringModule = angular.module('scoringModule');


scoringModule.factory('normalizeScoreName', function normalizeScoreNameFactory() {
    //'use strict';
    
    var fac = {
        //These are the config settings for the long name to abbreviation overides
        scoringConfig: {
            /*Football - Offense*/
            'RECREC' : 'REC',
            'PASSYDS': 'PAYD',
            'PASSTD' : 'PATD',
            'RUSHYDS': 'RUYD',
            'RUSHFL': 'FL',
            'RUSHTD': 'RUTD',
            'RECREC': 'REC',
            'RECYDS': 'RECYD',
            'PASSINT' : 'INT',
            /*Football - Defense*/
            'DSK': 'SACK',
            'DDPA': 'DPA',


            /*Baseball */
            '+1B': '1B',
            '+2B': '2B',
            '+3B': '3B',
            '+R': 'R',
            '+RBI': 'RBI',
            '-KO': 'KO',
            '+SAC': 'SAC',
            '+HR': 'HR',
            '+IP': 'IP',
            '+K': 'K',
            '+W': 'W',
            '+CG': 'CG',
            '-BB' : 'BB',
            '-HA' : 'HA',
            '-ER': 'ER',
            '+IP': 'IP',
            '-L': 'L',
            '+W': 'W',
            '-HB': 'HB',
            '+SB': 'SB',

            /*Hockey*/
            'OFFSOG': 'SOG',
            'DEFSOG': 'SOG',
            'DEF+/-': 'PM',
            'OFFAST': 'A',
            'DEFAST': 'A',
            'OFF+/-': 'PM',
            'OFFG': 'G',
            'DEFG': 'G',
            'DEFBS': 'BS',
            'OFFBS': 'BS',
            'DEFPIM': 'PIM',
            'OFFPIM': 'PIM',
            'GOALIEW': 'W',
            'GOALIESV': 'SV',
            'GOALIESO': 'SO',
            'GOALIEGA':'GA'
        },

        /*
         * This object maps long scoring type names to their abbreviates
         * longName - This is a required field that represents the type of score
         * longNameMod - Sometimes scoring names are split into two sections ex: Reception Yards vs Reception Touchdowns
         *               in these examples the longName mod would be yards or touchdowns.
         */
        normalizer: function (longName, longNameMod) {

            //Concatonate long name and long name mod if longname mod is not undefined
            var lname = longName + (typeof longNameMod != 'undefined' ? longNameMod : "");

            //Lookup shortname
            var name = this.scoringConfig[lname];

            //No lookup found happened.
            if(typeof name == 'undefined') name = lname;

            name = name.replace('+', '');
            name = name.replace('-', '');

            //if name is undefined then the longname should be used
            return name;
        }
    }
    return fac;
});