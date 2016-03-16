var profileStatsHeaderDirectives = angular.module('profileStatsHeaderDirectives');

profileStatsHeaderDirectives.directive('profileStatsheader', [ function () {
    //'use strict';
    
    return {
        scope: {
            leagueID: '@leagueid',
            posID: '@posid',
            statsType: '@statstype',
            optionalTeamPosId: '@optionalteamposid'

        },
        controller: function ($scope, $element, $attrs) {
 
           

        },
        link: function ($scope, $element, $attrs) {         
            var getPositionID = function () {
                return (angular.isDefined($scope.optionalTeamPosId) && $scope.optionalTeamPosId !== '') ? $scope.optionalTeamPosId : $scope.posID;
            }
            $attrs.$observe('statstype', function (val) {
                $scope.changeType();                
            });

            $scope.changeType = function (type) {
                //NOTE:  use this to customize for other tenants/code
                var html_begin = '<th class="borderless text-center">';
                var html_end = '</th>';

                var header = '';

                switch ($scope.leagueID) {
                    case '1':   //nfl
                        switch ($scope.statsType) {
                            case 'BO':
                                header = html_begin + 'STATISTICS' + html_end;
                                break;
                            case 'GL':
                                header = html_begin + 'OPP' + html_end;
                                header += html_begin + 'SCORE' + html_end;
                                header += html_begin + 'DATE' + html_end;
                                break;
                            case 'SS':
                                header = html_begin + 'STATISTICS' + html_end;
                                break;
                            case 'CA':
                                header = html_begin + 'YEAR/TEAM' + html_end;
                                break;
                            default:
                                break;
                        }

                        switch (getPositionID()) {
                            case '39': //QB
                                header += html_begin + 'FPPG' + html_end;
                                header += html_begin + 'GP' + html_end;
                                header += html_begin + 'CMP' + html_end;
                                header += html_begin + 'ATT' + html_end;
                                header += html_begin + 'YDS' + html_end;
                                header += html_begin + 'CMP%' + html_end;
                                header += html_begin + 'AVG' + html_end;
                                header += html_begin + 'LNG' + html_end;
                                header += html_begin + 'TD' + html_end;
                                header += html_begin + 'INT' + html_end;
                                header += html_begin + 'FUM' + html_end;
                                header += html_begin + 'TPC' + html_end;
                                header += html_begin + 'RAT' + html_end;
                                header += html_begin + 'ATT' + html_end;
                                header += html_begin + 'YDS' + html_end;
                                header += html_begin + 'AVG' + html_end;
                                header += html_begin + 'TD' + html_end;
                                break;

                            case '38': //RB
                                header += html_begin + 'FPPG' + html_end;
                                header += html_begin + 'GP' + html_end;
                                header += html_begin + 'ATT' + html_end;
                                header += html_begin + 'YDS' + html_end;
                                header += html_begin + 'AVG' + html_end;
                                header += html_begin + 'YPG' + html_end;
                                header += html_begin + 'LNG' + html_end;
                                header += html_begin + 'TD' + html_end;
                                header += html_begin + 'REC' + html_end;
                                header += html_begin + 'YDS' + html_end;
                                header += html_begin + 'AVG' + html_end;
                                header += html_begin + 'LNG' + html_end;
                                header += html_begin + 'TD' + html_end;
                                header += html_begin + 'FUM' + html_end;
                                header += html_begin + 'LST' + html_end;
                                break;

                            case '1': //WR                          
                            case '2': //TE
                                header += html_begin + 'FPPG' + html_end;
                                header += html_begin + 'GP' + html_end;
                                header += html_begin + 'REC' + html_end;
                                header += html_begin + 'YDS' + html_end;
                                header += html_begin + 'AVG' + html_end;
                                header += html_begin + 'YPG' + html_end;
                                header += html_begin + 'LNG' + html_end;
                                header += html_begin + 'TD' + html_end;
                                header += html_begin + 'ATT' + html_end;
                                header += html_begin + 'YDS' + html_end;
                                header += html_begin + 'YPG' + html_end;
                                header += html_begin + 'LNG' + html_end;
                                header += html_begin + 'TD' + html_end;
                                header += html_begin + 'FUM' + html_end;
                                header += html_begin + 'LST' + html_end;
                                break;

                            default:
                                break;
                        }


                        break;

                    case '2':   //nba
                        switch ($scope.statsType) {
                            case 'BO':
                                header = html_begin + 'STATISTICS' + html_end;
                                header += html_begin + 'GP' + html_end;
                                break;
                            case 'GL':
                                header = html_begin + 'OPP' + html_end;
                                header += html_begin + 'SCORE' + html_end;
                                header += html_begin + 'DATE' + html_end;
                                break;
                            case 'SS':
                                header = html_begin + '             ' + html_end;
                                header += html_begin + 'GP' + html_end;
                                break;
                            case 'CA':
                                header = html_begin + 'YEAR/TEAM' + html_end;
                                header += html_begin + 'GP' + html_end;
                                break;
                            default:
                                break;
                        }

                        header += html_begin + 'FPPG' + html_end;
                        header += html_begin + 'PTS' + html_end;
                        header += html_begin + 'AST' + html_end;
                        header += html_begin + 'REB' + html_end;
                        header += html_begin + 'STL' + html_end;
                        header += html_begin + 'BLK' + html_end;
                        header += html_begin + 'TO' + html_end;
                        header += html_begin + 'FGM' + html_end;
                        header += html_begin + 'FGA' + html_end;
                        header += html_begin + 'FTM' + html_end;
                        header += html_begin + 'FTA' + html_end;
                        header += html_begin + '3PM' + html_end;
                        header += html_begin + '3PA' + html_end;
                        header += html_begin + 'PF' + html_end;
                        header += html_begin + 'FG%' + html_end;
                        header += html_begin + 'FT%' + html_end;
                        header += html_begin + '3P%' + html_end;
                        header += html_begin + 'MIN' + html_end;

                        break;

                    case '3':   //mlb

                        switch ($scope.statsType) {
                            case 'BO':
                                header = html_begin + 'STATISTICS' + html_end;
                                break;
                            case 'GL':
                                header = html_begin + 'OPP' + html_end;
                                header += html_begin + 'SCORE' + html_end;
                                header += html_begin + 'DATE' + html_end;
                                break;
                            case 'SS':
                                header = html_begin + '' + html_end;
                                header += html_begin + 'G' + html_end;
                                break;
                            case 'CA':
                                header = html_begin + 'YEAR/TEAM' + html_end;
                                header += html_begin + 'G' + html_end;
                                break;
                            default:
                                break;
                        }
                        switch (getPositionID()) {
                            case '16':   //pitcher
                            case '44':
                                header += html_begin + 'FPPG' + html_end;
                                header += html_begin + 'GS' + html_end;
                                header += html_begin + 'W' + html_end;
                                header += html_begin + 'L' + html_end;
                                header += html_begin + 'S' + html_end;
                                header += html_begin + 'IP' + html_end;
                                header += html_begin + 'HA' + html_end;
                                header += html_begin + 'R' + html_end;
                                header += html_begin + 'ER' + html_end;
                                header += html_begin + 'HR' + html_end;
                                header += html_begin + 'SO' + html_end;
                                header += html_begin + 'BB' + html_end;
                                header += html_begin + 'CG' + html_end;
                                header += html_begin + 'SHO' + html_end;
                                header += html_begin + 'ERA' + html_end;
                                header += html_begin + 'WHIP' + html_end;
                                header += html_begin + 'BAA' + html_end;
                                break;

                            default: //everything else
                                header += html_begin + 'FPPG' + html_end;
                                header += html_begin + 'AB' + html_end;
                                header += html_begin + 'H' + html_end;
                                header += html_begin + 'R' + html_end;
                                header += html_begin + 'HR' + html_end;
                                header += html_begin + 'RBI' + html_end;
                                header += html_begin + 'D' + html_end;
                                header += html_begin + 'T' + html_end;
                                header += html_begin + 'BB' + html_end;
                                header += html_begin + 'KO' + html_end;
                                header += html_begin + 'SB' + html_end;
                                header += html_begin + 'CS' + html_end;
                                header += html_begin + 'SAC' + html_end;
                                header += html_begin + 'AVG' + html_end;
                                header += html_begin + 'OBP' + html_end;
                                header += html_begin + 'SLG' + html_end;
                                header += html_begin + 'OPS' + html_end;
                                break;
                        }

                        break;

                    case '4':  //nhl
                        switch ($scope.statsType) {
                            case 'BO':
                                header = html_begin + 'STATISTICS' + html_end;
                                header += html_begin + 'GP' + html_end;
                                break;
                            case 'GL':
                                header = html_begin + 'OPP' + html_end;
                                header += html_begin + 'SCORE' + html_end;
                                header += html_begin + 'DATE' + html_end;
                                break;
                            case 'SS':
                                header += html_begin + ' ' + html_end;
                                header += html_begin + 'GP' + html_end;
                                break;
                            case 'CA':
                                header = html_begin + 'YEAR/TEAM' + html_end;
                                header += html_begin + 'GP' + html_end;
                                break;
                            default:
                                break;
                        }

                        switch (getPositionID()) {
                            case '50':   //goalie
                                header += html_begin + 'FPPG' + html_end;
                                header += html_begin + 'DEC' + html_end;
                                header += html_begin + 'W' + html_end;
                                header += html_begin + 'L' + html_end;
                                header += html_begin + 'OTL' + html_end;
                                header += html_begin + 'GA' + html_end;
                                header += html_begin + 'SA' + html_end;
                                header += html_begin + 'SV' + html_end;
                                header += html_begin + 'SV%' + html_end;
                                header += html_begin + 'GAA' + html_end;
                                header += html_begin + 'SO' + html_end;
                                header += html_begin + 'PIM' + html_end;
                                header += html_begin + 'ENGA' + html_end;
                                header += html_begin + 'GP' + html_end;
                                header += html_begin + 'GS' + html_end;
                                header += html_begin + 'TOI' + html_end;
                                break;

                            default: //everything else

                                header += html_begin + 'FPPG' + html_end;
                                header += html_begin + 'G' + html_end;
                                header += html_begin + 'A' + html_end;
                                header += html_begin + 'PTS' + html_end;
                                header += html_begin + '+/-' + html_end;
                                header += html_begin + 'SOG' + html_end;
                                header += html_begin + 'PIM' + html_end;
                                header += html_begin + '%' + html_end;
                                header += html_begin + 'PPG' + html_end;
                                header += html_begin + 'PPA' + html_end;
                                header += html_begin + 'SHG' + html_end;
                                header += html_begin + 'SHA' + html_end;
                                header += html_begin + 'BS' + html_end;
                                header += html_begin + 'TOI' + html_end;
                                header += html_begin + 'HITS' + html_end;
                                header += html_begin + 'FOW%' + html_end;
                                break;
                        }
                        break;


                    case '8':  //soccer leagues
                    case '15':
                    case '17':
                    case '18':
                    case '19':
                    case '20':
                    case '21':
                    case '22':

                        break;

                    default:
                        break;
                }

                $element.html(header);
            };
    }
    };

}]);
