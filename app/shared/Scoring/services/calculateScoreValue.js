/*
 * This service takes in a score type and the value of the score type, and returns the number of fantasy points gained or lost 
 */

//Add this to the scoring module
var scoringModule = angular.module('scoringModule');


scoringModule.factory('calculateScoreValue', function calculateScoreValueFactory() {
    //'use strict';
    
    var fac = {
        /*
        * These are the config settings for the current scoring values of the form
        *  
        *  'SCORE NAME' : [MIN VALUE,MAX VALUE, SCORE , MIN VALUEX,MAX VALUEX,SCORE, MIN VALUE, SCORE]
        * 
        * Consecutive Min and Max values represent a range of points that will return a particular score. If there is no max value then 
        * then that represents its the min value or greater
        */
        scoringConfig: {
            /*Football - Offense*/
            'PATD': [0, 4.00],
            'INT': [0, -1.00],
            'PAYD': [0, 0.04],
            'RUYD': [0, 0.10],
            'RUTD': [0, 6.00],
            'RECYD': [0, 0.10],
            'RECTD': [0, 6.00],
            'REC': [0, 1.00],
            'RTD': [0, 6.00],
            '2PT': [0, 2.00],
            'FL': [0, -1.00],
            'FG': [0, 39, 3.00, 40, 49, 4.00, 50, 5.00],
            'XPM': [0, 1.00],

            /*Football - Defense*/
            'DTD': [0, 6.00],
            'RTD': [0, 6.00],
            'DINT': [0, 1.00],
            'SACK': [0, 0.50],
            'SFTY': [0, 2.00],
            'FR': [0, 1.00],
            'BK': [0, 2.00],
            'D2PT': [0, 2.00],
            '2PT': [0, 2.00],
            'DPA': [0, 2, 10.00, 3, 6, 7.00, 7, 10, 4.00, 11, 15, 2.00, 16, 25,0.00, 26, -3.00],

            /*Baseball - Batting*/
            '1B': [0, 1.00],
            '2B': [0, 2.00],
            '3B': [0, 3.00],
            'HR': [0, 4.00],
            'BB': [0, 0.75],
            'R': [0, 1.50],
            'RBI': [0, 1.50],
            'SB': [0, 2.00],
            'CS': [0, -1.00],
            'KO': [0, -0.75],
            'SAC': [0, 0.75],
            'HP': [0, 0.75],


            /*Baseball - Pitching*/
            'BBP': [0, -0.25],
            'HA': [0, -0.25],
            'HB': [0, -0.25],
            'ER': [0, -0.75],
            'IP': [0, 0.90],
            'K': [0, 0.70],
            'L': [0, -0.75],
            'WBAS': [0, 1.50],
            'CG': [0, 2.00],
            'BBS': [0, 3.00],
            'BBBS': [0,-1.00],

            /*BasketBall*/
            /*NBA*/
            'PTS': [0, 1.00],
            'REB': [0, 1.25],
            'AST': [0, 1.50],
            'STL': [0, 2.00],
            'BLK': [0, 2.00],
            'TO': [0, -1.00],
            'MSFT': [0, -0.50],
            'MSFG': [0, -0.50],

            /*Skating*/
            'SOG': [0, 0.30],
            'G': [0, 3.00],
            'A': [0, 2.00],
            'PM': [0, 0.50],
            'PIM': [0, 0.25],
            'PPG': [0, 0.50],
            'PPA': [0, 0.50],
            'SHG': [0, 1.00],
            'SHA': [0, 1.00],
            'BS': [0, 0.30],

            'WHO': [0, 3.00],
            'GA': [0, -1.50],
            'SV': [0, 0.30],
            'SO': [0, 2.00],
            'OFFPPG': [0, 0.00]

        },

        /*
         * Takes in a score abbreviation and value and returns the number of fantasy points that would be earned
         */
        getScoreValue: function (scoreName, scoreValue) {
            var scoreArray = this.scoringConfig[scoreName];

            //if the length of the array is two then all values get the same score.
            var isSimple = scoreArray.length == 2;

            //Cut the max value and score out of the array 
            var maxValueAndScore = scoreArray.slice(-2);

            //What to multiply the value by to get number of fantasy points earned
            var scoreModifier = maxValueAndScore[1];

            if (!isSimple) {
                for (var x = 0; x < scoreArray.length - 2; x += 3) {
                    var min = scoreArray[x];
                    var max = scoreArray[x + 1];

                    if (scoreValue >= min && scoreValue <= max) {
                        scoreModifier = scoreArray[x + 2];
                        break;
                    }
                }
            }

            return scoreModifier
        }
    }
    return fac;
});