
angular.module('CreateALeague', ['ui.bootstrap', 'genericModalService', 'errorMessages']);

angular.module('CreateALeague').controller('CreateALeagueController', ['$scope', '$uibModal', '$log', 'clientFactory', 'accountModalService', 'GenericModal', 'errorFactory', function ($scope, $uibModal, $log, clientFactory, accountModalService, GenericModal, errorFactory) {
    //'use strict';
    $scope.availLeaguesResult = null;
    $scope.acctResult = null;
    $scope.tenResult = null;
    
    $scope.openCreateALeague = function () {
        if (clientFactory.getAccountId()) {
            // You must be able to run cash actions to create a fantasy league
            accountModalService.runCashAction(function () {
                $.when(clientFactory.leagues().GetAvailableLeagues().dataOnly(), clientFactory.getCachedAccountByID(clientFactory.getAccountId(), true), clientFactory.tenants().GetTenantById(4).dataOnly())
                .done(function (availLeaguesResult, acctResult, tenResult) {
                    $scope.availLeaguesResult = availLeaguesResult;
                    $scope.acctResult = acctResult;
                    $scope.tenResult = tenResult;
                    var modalInstance = $uibModal.open({
                        templateUrl: 'createALeagueModalContent.html',
                        controller: 'CreateALeagueInstanceController',
                        scope: $scope,
                        size: 'lg'

                    });
                    $scope.$apply();
                });
            });
        }
        else {
            accountModalService.displayLoginModal();
        }
    };
    
}]);

 //Please note that $modalInstance represents a modal window (instance) dependency.
 //It is not the same as the $uibModal service used above.

angular.module('CreateALeague').controller('CreateALeagueInstanceController',
    ['$scope', '$uibModalInstance', 'clientFactory', '$filter', '$window', 'GenericModal', 'errorFactory',
    function ($scope, $uibModalInstance, clientFactory, $filter, $window, GenericModal, errorFactory) {
    //'use strict';

    $scope.availLeagues = $scope.availLeaguesResult;
    $scope.account = $scope.acctResult;
    $scope.tenant = $scope.tenResult;
    $scope.prizeStruct = null;
    $scope.abbrevPrizeList = [];
    $scope.selectedLeague = 'League';
    $scope.selectedMatchupDT = 'Game Date';
    $scope.selectedDraftStyle = 'Draft Style';
    $scope.selectedMatchups = [];
    $scope.entriesList = [];
    $scope.selectedNumEntries = '-';
    $scope.selectedBuyIn = 1;
    $scope.specialPointsEntryFee = $scope.selectedBuyIn * 2000;
    $scope.betStyles = [];
    $scope.selectedGameType = 'Game Type';
    $scope.invalidBetStyle = [];
    $scope.showJoinBtn = false;
    $scope.showPrizeStruct = false;
    $scope.leagueDur = null;
    $scope.passwordsMatch = false;
    $scope.password = '';
    $scope.confirmPassword = '';
    
    $scope.payment = '';
    $scope.notEnoughMoney = false;
    $scope.notEnoughPoints = false;
    $scope.errormsg = '';
    $scope.payWithStarPoints = false;
    
    for (var i = 0, max = 20; i <= max; i++) {
        if (i >= 2) {
            $scope.entriesList[i] = i;
        }
    }

    for (betStyleIdx in FlowerCityGaming.V1.Constants.FantasyLeagueBettingStyleID) {
        if (!isNaN(parseFloat(betStyleIdx)) && isFinite(betStyleIdx)) {
            $scope.betStyles.push({ betStyleID: betStyleIdx, betStyleName: FlowerCityGaming.V1.Constants.FantasyLeagueBettingStyleID[betStyleIdx], disable: false });
        }
    }
    
    
    $scope.checkIfJoin = function () {
        //get message or error message to show user if they can join the league or not.
        //FlowerCityGaming.V1.logMessage($scope.account.userBalance);
        $scope.notEnoughMoney = false;
        $scope.notEnoughPoints = false;
        //FlowerCityGaming.V1.logMessage('pts ' + $scope.account.userBalance + ' ' + $scope.selectedBuyIn)
        if ($scope.account.userBalance < $scope.selectedBuyIn) {
            $scope.notEnoughMoney = true;
            $scope.showJoinBtn = false;
        }
        if ($scope.tenant.bonusPoints != null || $scope.tenant.bonusPoints != '') {
            if ($scope.account.internalPoints < $scope.specialPointsEntryFee) { 
                $scope.notEnoughPoints = true;
                $scope.showJoinBtn = false;
            }
        }

        $scope.errormsg = '';
        if ($scope.notEnoughMoney && $scope.notEnoughPoints) {
            $scope.errormsg = 'You do not have enough money or ' + $scope.tenant.bonusPoints + ' in your account to join the league, but you can add more money below';
        }
        
        //FlowerCityGaming.V1.logMessage($scope.payment + ' ' + ($scope.showPrivate ? $scope.passwordsMatch : true));
        if ($scope.payment != '' && $scope.payment != null && $scope.errormsg == '' && $scope.prizeStruct != null && ($scope.showPrivate ? $scope.passwordsMatch : true)) {
            
            $scope.showJoinBtn = true;
            if (!$scope.payWithStarPoints) {
                $scope.payment = $filter('currency')($scope.selectedBuyIn, '$', 0);
                $scope.selectedCurrencyType = FlowerCityGaming.V1.Constants.CURRENCY_USD;
            }
            else if ($scope.payWithStarPoints) {
                $scope.payment = $scope.specialPointsEntryFee + ' ' + $scope.tenant.bonusPoints;
                $scope.selectedCurrencyType = FlowerCityGaming.V1.Constants.CURRENCY_SFP;
            }

            //FlowerCityGaming.V1.logMessage('showjoinbtn');
            
        }

       
    }

    $scope.getPrizeStruct = function () {
        $scope.abbrevPrizeList = [];
        if ($scope.selectedNumEntries != '-' && $scope.selectedGameType != 'Game Type' && $scope.selectedBuyIn > 0 && $scope.selectedLeague != 'League' && $scope.selectedMatchups != '' && $scope.selectedDraftStyle != 'Draft Style') {
            if ($scope.selectedLeague == FlowerCityGaming.V1.Constants.Leagues["NFL"]) {
                $scope.leagueDur = 3;
            }
            else {
                $scope.leagueDur = 1;
            }
            //numEntries, fantasyLeagueBettingStyleID, entryFee, leagueID, fantasyLeagueDurationID, autoGenerated
            clientFactory.fantasyLeagues().GetPrizeStructureForFantasyLeagueByParams($scope.selectedNumEntries, $scope.selectedGameType, $scope.selectedBuyIn, $scope.selectedLeague, $scope.leagueDur, false)
                 .done(function (prizeResult) {
                     $scope.prizeStruct = prizeResult;
                     $scope.showPrizeStruct = true;
                     $scope.abbrevPrizeList = [];

                     var i, j, match;
                     for (i = 0; i < prizeResult.prizeList.length; i++) {
                         if ($scope.abbrevPrizeList === []) {
                             $scope.abbrevPrizeList[0] = {
                                 startRank: prizeResult.prizeList[0].prizeRankName,
                                 endRank: prizeResult.prizeList[0].prizeRankName,
                                 prizeValue: prizeResult.prizeList[0].prizeValue,
                                 prizeValueCurrency: prizeResult.prizeList[0].prizeValueCurrency
                             };
                         }
                         else {
                             match = false;
                             for (j = 0; j < $scope.abbrevPrizeList.length; j++) {
                                 if ($scope.abbrevPrizeList[j].prizeValue == prizeResult.prizeList[i].prizeValue && !match) {
                                     $scope.abbrevPrizeList[j].endRank = prizeResult.prizeList[i].prizeRankName;
                                     match = true;
                                 }
                             }
                             if (!match) {
                                 $scope.abbrevPrizeList.push({
                                     startRank: prizeResult.prizeList[i].prizeRankName,
                                     endRank: prizeResult.prizeList[i].prizeRankName,
                                     prizeValue: prizeResult.prizeList[i].prizeValue,
                                     prizeValueCurrency: prizeResult.prizeList[i].prizeValueCurrency
                                 });
                             }
                         }
                     }
                     $scope.$apply();
                 });
        }
        else {
            $scope.prizeStruct = null;
            $scope.showPrizeStruct = false;
            $scope.checkIfJoin();
        }
       
    }

    $scope.leagueOnChange = function () {
        
        clientFactory.leagues().GetValidStartGamesForCreateFantasyLeague($scope.selectedLeague)
        .done(function (upcomingMatchups) {
            $scope.upcomingMatchups = upcomingMatchups;
            $scope.upcomingMatchups.sort(function (a, b) {
                return a.startDate - b.startDate;
            });
            //FlowerCityGaming.V1.logMessage($scope.upcomingMatchups);
            
        });
        $scope.getPrizeStruct();
    }

    $scope.matchupsOnChange = function () {
        $scope.selectedMatchups = [];
        var dateSel = new Date($scope.selectedMatchupDT);
        //GetUpcomingMatchups = function (leagueID, getOnlyOneDayOrWeek, getMatchupsThatStartAtOrAfterThisTime)
        clientFactory.leagues().GetUpcomingMatchups($scope.selectedLeague, true, $scope.selectedMatchupDT)
        .done(function (upcomingMatchups) {
            $scope.selectedMatchups = upcomingMatchups;
            //FlowerCityGaming.V1.logMessage($scope.selectedMatchups);
            $scope.$apply();
        });
        $scope.getPrizeStruct();
    }

    $scope.buyInIsValid = function () {
        //FlowerCityGaming.V1.logMessage('buyin ' + $scope.selectedBuyIn);
        if ($scope.selectedBuyIn == 0 || !$scope.selectedBuyIn) {
            $scope.selectedBuyIn = 1;
        }
        var dec = ($scope.selectedBuyIn).indexOf('.');
        if (dec > -1) {
            $scope.selectedBuyIn = ($scope.selectedBuyIn).substring(0, dec);
        }
        $scope.specialPointsEntryFee = $scope.selectedBuyIn * 2000;
        $scope.getPrizeStruct();
        //FlowerCityGaming.V1.logMessage('$scope.selectedMatchups' + $scope.selectedMatchups + ' ' + ($scope.selectedMatchups != ''));
        $scope.getPrizeStruct();
        $scope.checkIfJoin();
    }

    $scope.numEntriesOnChange = function () {
        $scope.invalidBetStyle = [];
        if ($scope.selectedNumEntries == 2) {
            $scope.invalidBetStyle = [2, 3, 4, 5];

        }
        else if ($scope.selectedNumEntries == 3 || $scope.selectedNumEntries == 5) {
            $scope.invalidBetStyle = [1, 2, 4, 5];
        }
        else if ($scope.selectedNumEntries == 4) {
            $scope.invalidBetStyle = [1, 4, 5];
        }
        // All betting styles available for players 7-20 where odd, except double-up
        else if ($scope.selectedNumEntries % 2 == 1) {
            $scope.invalidBetStyle = [2];
        }
        // Only divisible by 3 games can be triple-up
        if ($scope.selectedNumEntries % 3 != 0 || $scope.selectedNumEntries < 6) {
            $scope.invalidBetStyle.push(6);
        }
        // Remove top 20% from nums < 13 (cause it only pays to the top 3)
        if ($scope.selectedNumEntries < 13) {
            $scope.invalidBetStyle.push(5);
        }

        for (var i = 0; i < $scope.betStyles.length; i++) {
            $scope.betStyles[i].disable = false;
            if (($scope.invalidBetStyle).indexOf(parseInt($scope.betStyles[i].betStyleID)) > -1) {
                $scope.betStyles[i].disable = true;
            }
        }
        $scope.getPrizeStruct();
    }

    $scope.gameTypeOnChange = function () {
        $scope.getPrizeStruct();
    }

    $scope.checkPassword = function () {
        //FlowerCityGaming.V1.logMessage($scope.password);
        //FlowerCityGaming.V1.logMessage($scope.confirmPassword);
        if ($scope.password != '' && $scope.confirmPassword != '') {
            $scope.passwordsMatch = ($scope.password == $scope.confirmPassword);
        }
        else { $scope.passwordsMatch = false; }
        $scope.checkIfJoin();
    }

    $scope.createTheLeague = function () {
        clientFactory.fantasyLeagues().CreateFantasyLeague({
            
            accountID: clientFactory.getAccountId(),
            name:'User Created a League',
            leagueid: $scope.selectedLeague,
            fantasydraftstyleid: $scope.selectedDraftStyle,
            fantasyleaguebettingstyleid: $scope.selectedGameType,
            maxnumberplayers: $scope.selectedNumEntries,
            entryfee: $scope.selectedBuyIn,
            startdate: $scope.selectedMatchupDT,
            startgameid:$scope.selectedMatchups[0].gameID,
            isPrivateLeague:$scope.showPrivate,
            PayWithStarPoints: $scope.payWithStarPoints,
            LeaguePassword: $scope.password,
            LeaguePasswordConfirm: $scope.confirmPassword,

        })
        .done(function (createFLResult, listDetails, headers) {
            $scope.createFLResult = createFLResult;
            //FlowerCityGaming.V1.logMessage('createFL: ',createFLResult.resourceIdentifier);
            if (createFLResult) {
                //join league
                clientFactory.fantasyTeams().CreateFantasyTeam({
                    accountID: clientFactory.getAccountId(),
                    fantasyleagueid: createFLResult.resourceIdentifier,
                    currencytype: $scope.selectedCurrencyType,
                    useticket: false
                })
                  .done(function (createFTResult) {
                      clientFactory.getCachedAccountByID(clientFactory.getAccountId(), true)
                      .then(function (refreshAcct) {
                          $scope.createFTResult = createFTResult;
                          $window.location.href = "/#/draft/" + createFLResult.resourceIdentifier + "/" + createFTResult.resourceIdentifier;
                      });
                  })
                     
                  .fail(function (error) {
                      FlowerCityGaming.V1.logError("An Error Has Occurred");
                      //TODO: need to normalize api errors returned to always be .message                      
                      errorFactory.displayErrors(error, "Error creating Fantasy Team.");
                  });
                 
                $scope.$apply();
                $uibModalInstance.dismiss('cancel');
            }
        })
        .fail(function (error) {
            FlowerCityGaming.V1.logError("An Error Has Occurred");

            //TODO: need to normalize api errors returned to always be .message
            errorFactory.displayErrors(error, "Error creating Fantasy Team.");
            $scope.$apply();
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
