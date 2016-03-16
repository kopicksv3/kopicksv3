var almHelper = angular.module('almHelper', []);

almHelper.service('almNamingService', ['$filter', function ($filter) {
    this.setLeagueNames = function (leagues) {
        for (l in leagues) {
            leagues[l].name = $filter('getLeagueName')(leagues[l].name, leagues[l].entryFee, leagues[l].canOnlyBeJoinedWithTickets,
                                                       leagues[l].sizeOfPrizePool, leagues[l].currencyPayoutType,
                                                       leagues[l].maxNumberPlayers, leagues[l].if_1_of_2_UserName_of_1,
                                                       leagues[l].h2H_FLIDS_Of_Group.length, leagues[l].fantasyLeagueBettingStyleID,
                                                       leagues[l].isQualifier, leagues[l].maxNumberEntriesPerUser);
        }
        return leagues;
    };

}]);