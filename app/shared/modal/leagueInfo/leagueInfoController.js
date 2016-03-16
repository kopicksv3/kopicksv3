var LeagueInfo = angular.module('LeagueInfo', ['ui.bootstrap', 'genericModalService', 'errorMessages', 'accountModals', 'fantasyLeagueServices']);

LeagueInfo.controller('LeagueInfoController', ['$scope', '$uibModal', '$log', 'clientFactory', '$window', 'GenericModal', 'accountModalService', '$location', function ($scope, $uibModal, $log, clientFactory, $window, GenericModal, accountModalService, $location) {
    //'use strict';
    
    $scope.id = null;
    $scope.fl = null;
    $scope.acct = null;
    var acctPromise = null;
    $scope.fLeaguePromise = null;
    $scope.abbrevPrizeList = [];

    //$scope.verAcct = FlowerCityGaming.V1.Constants.UserLocationVerification.VerificationStatus;
    
    $scope.openLeagueInfo = function (id, joinedMaxTimes, leagueInfoButton) {
        $scope.id = id;
        $scope.leagueInfoButton = leagueInfoButton;

        if (!clientFactory.getAccountId()) {
            $location.path('/lobby');
            accountModalService.displayLoginModal();
        } else if (joinedMaxTimes) {
            
            var modalInstance = $uibModal.open({
                templateUrl: 'JoinedLeagueMaxTimesModalContent.html',
                controller: 'JoinedLeagueMaxTimesInstanceController',
                scope: $scope,
                size: 'lg'

            });
         
        }
        
        else {
            $.when(clientFactory.getCachedAccountByID(clientFactory.getAccountId(), true), clientFactory.fantasyLeagues().GetFantasyLeagueByID(id).dataOnly(), clientFactory.fantasyLeagues().GetFantasyLeagueMatchups(id).dataOnly(), clientFactory.fantasyLeagues().GetFantasyLeaguePrizeStructure(id).dataOnly(), clientFactory.tenants().GetTenantById(4).dataOnly())
            .done(function (acctResult, flResult, matchResult, prizeResult, tenResult) {
           
                $scope.fl = flResult;
                $scope.acct = acctResult;
                //Removes any games being retunred that start before the startDate
                $scope.mtchs = inRange(matchResult, flResult.scoringStartDate_ms);
                $scope.ten = tenResult;
                $scope.prize = prizeResult;
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

                // Cash game is defined as either having an entry fee, or paying out in USD > 0
                var isCashGame =
                    (flResult.entryFee !== 0) ||
                    (flResult.payoutCurrencyType === "USD" && flResult.sizeOfPrizePool > 0);
                
                var fnShowLeagueInfoModal = function () {
                    $uibModal.open({
                templateUrl: 'leagueInfoModalContent.html',
                controller: 'LeagueInfoInstanceController',
                scope: $scope,
                size: 'lg'
                    });
                };

                if (isCashGame == false || leagueInfoButton == true) {
                    // Not a cash game; skip the cash action eligibility check and just show the modal
                    fnShowLeagueInfoModal();
                }
                else {
                    // Verify the user is eligible for cash actions before continuing
                    accountModalService.runCashAction(fnShowLeagueInfoModal);
                }
            
                $scope.$apply();
            });
        
        }

        function inRange(games, date) {
            var results = [];
            for (g in games) {
                var gTime =  Date.parse(games[g].startDate);                
                if (gTime >= date) {
                    results.push(games[g]);
                }                
            }
            return results;
        };
    };
}]);

  // Please note that $modalInstance represents a modal window (instance) dependency.
        // It is not the same as the $uibModal service used above.

LeagueInfo.controller('LeagueInfoInstanceController', ['$scope', '$uibModalInstance', 'clientFactory', '$filter', '$window', 'fantasyLeagueSignaler', 'GenericModal', 'errorFactory', function ($scope, $uibModalInstance, clientFactory, $filter, $window, fantasyLeagueSignaler, GenericModal, errorFactory) {
    //'use strict';
    $scope.loading = true;

    
    if ($scope.fl.salaryCap == null || $scope.fl.salaryCap == 0) {
        $scope.fl.salaryCap = 100000; // default in case server side gives the wrong value
    }

    /////fantasyLeague.sizeOfPrizePool
    //payoutCurrencyType == 
    var sizeOfCommissionInCashFromFantasyLeague = 0; // If the total buy-ins are $500 and it pays out $450, this is $50
    var sizeOfCommissionInCashPerUser = 0; // If it's 10 people and total commission is $50, this is $5
    var sizeOfCommissionInCashPercentOfBuyIn = 0; // If the cost per user is $5 and the entry fee is $50, this is 10%
    if ( // We can only calculate commission if it's not free, and the payout isn't 0, and we know the number of players
        $scope.fl.entryFee != null
        && $scope.fl.entryFee > 0
        && $scope.fl.sizeOfPrizePool != null
        && $scope.fl.sizeOfPrizePool > 0
        && $scope.fl.maxNumberPlayers != null
        && $scope.fl.maxNumberPlayers > 0
        && $scope.fl.payoutCurrencyType == FlowerCityGaming.V1.Constants.CURRENCY_USD) {
        // javascript's math isn't very good, so we're going to have some liberal use of parseInt, parseFloat, and (Math.round(n * 100) / 100) here. 
        // if you don't believe me, open a console and do 12.029 - 12. You get 0.028999999999999915
        var numPlayers = parseInt($scope.fl.maxNumberPlayers, 10);
        var entryFee = parseInt($scope.fl.entryFee, 10);
        var sizeOfPrizePool = (Math.round(parseFloat($scope.fl.sizeOfPrizePool) * 100) / 100);

        // total paid in - total paid out == commission
        sizeOfCommissionInCashFromFantasyLeague = (Math.round(((numPlayers * entryFee) - sizeOfPrizePool) * 100) / 100);
        // total commission per player == commission / num players
        sizeOfCommissionInCashPerUser = (Math.round((sizeOfCommissionInCashFromFantasyLeague / numPlayers) * 100) / 100);
        // percentage is then the amount per user / entry fee * 100. 
        // we round by an extra magnitude of 100 so we get the percentage as a whole number (like 9.09% as opposed to 0.0909)
        sizeOfCommissionInCashPercentOfBuyIn = (Math.round((sizeOfCommissionInCashPerUser / entryFee) * 10000) / 100);
    }
    $scope.sizeOfCommissionInCashFromFantasyLeague = sizeOfCommissionInCashFromFantasyLeague;
    $scope.sizeOfCommissionInCashPerUser = sizeOfCommissionInCashPerUser;
    $scope.sizeOfCommissionInCashPercentOfBuyIn = sizeOfCommissionInCashPercentOfBuyIn;

    $scope.fantasyLeague = $scope.fl;
    $scope.account = $scope.acct;
    $scope.matchups = $scope.mtchs;
    $scope.tenant = $scope.ten;
    $scope.prizeStruct = $scope.prize;
    $scope.selectedCurrencyType = '';
    
    $scope.showJoinBtn = false;
    //$scope.verifiedAccount = $scope.verAcct;

    $scope.notEnoughMoney = false;
    $scope.notEnoughPoints = false;
    $scope.errormsg = 'You don&#39;t have enough ';
    
    //get message or error message to show user if they can join the league or not.
    //FlowerCityGaming.V1.logMessage($scope.account.userBalance);
    if ($scope.account.userBalance < $scope.fantasyLeague.entryFee) {
        $scope.notEnoughMoney = true;
    }
    if ($scope.tenant.bonusPoints != null || $scope.tenant.bonusPoints != '') {
        if ($scope.account.internalPoints < $scope.fantasyLeague.specialPointsEntryFee) { //REPLACE WITH ENTRY POINTS FEE)
            $scope.notEnoughPoints = true;
        }
    }
    if ($scope.fantasyLeague.entryFee == 0) {
        $scope.payment = $filter('currency')(0, '$', 0);
        $scope.selectedCurrencyType = FlowerCityGaming.V1.Constants.CURRENCY_USD;
    }

    $scope.errormsg = '';
    if ($scope.notEnoughMoney && $scope.notEnoughPoints)
        $scope.errormsg = 'You do not have enough money or ' + $scope.tenant.bonusPoints + ' in your account to join the league, but you can add more money below';
    else if ($scope.notEnoughMoney)
        $scope.errormsg = 'You do not have enough money in your account to join the league, but you can add more money below';
    
    if ($scope.payment != '' && $scope.errormsg == '' && $scope.selectedCurrencyType != '') {
        $scope.showJoinBtn = true;

    }
    $scope.loading = false;

    $scope.onChangePayment = function (paymentType, paymentAmount) {
        if (paymentType == FlowerCityGaming.V1.Constants.CURRENCY_USD) {
            $scope.payment = $filter('currency')(paymentAmount, '$', 0);
            $scope.selectedCurrencyType = FlowerCityGaming.V1.Constants.CURRENCY_USD;
        }
        else if (paymentType == FlowerCityGaming.V1.Constants.CURRENCY_SFP) {
            $scope.payment = paymentAmount + ' ' + $scope.tenant.bonusPoints;
            $scope.selectedCurrencyType = FlowerCityGaming.V1.Constants.CURRENCY_SFP;
        }

        $scope.checkIfJoin();
    }

    $scope.joinLeague = function () {
        FlowerCityGaming.V1.logMessage('currency', $scope.selectedCurrencyType);
        clientFactory.fantasyTeams().CreateFantasyTeam({
            accountID: clientFactory.getAccountId(),
            fantasyleagueid: $scope.id,
            currencytype:$scope.selectedCurrencyType,
            useticket:false
        })
          .done(function (createFTResult, listDetails, headers) {
              clientFactory.getCachedAccountByID(clientFactory.getAccountId(), true);
              $scope.createFTResult = createFTResult;
              FlowerCityGaming.V1.logMessage(createFTResult);
              
              if (createFTResult) {
                  $scope.joinedTeamID = createFTResult.resourceIdentifier;
                  var modalInstance = null;

                  if ($scope.joinedTeamID) {
                      clientFactory.fantasyTeams().GetFantasyTeamByID($scope.joinedTeamID)
                      .done(function (getTeam) {

                          FlowerCityGaming.V1.logMessage(getTeam);
                          $scope.newLeagueID = getTeam.fantasyLeagueID;
                          //NOTE: For this to be perfect we probabaly need to make sure this only runs if it was successful.
                          fantasyLeagueSignaler.sendLeagueChangedMessage(clientFactory.getAccountId(), getTeam.fantasyLeagueID)
                          $window.location.href = "/#/draft/" + $scope.newLeagueID + "/" + $scope.joinedTeamID;
                      })
                     .fail(function (error) {
                         // TODO: Better error handling
                         errorFactory.displayErrors(error, "Error retrieving Fantasy Team");
                         //GenericModal.showModal('Error', errorFactory.getErrorMessage(error.message));

                     });
                  } 
                      
              }

              $scope.$apply();
              
          })
            //TODO: error handling 
          .fail(function (error) {              
              FlowerCityGaming.V1.logError("An Error Has Occurred");
              errorFactory.displayErrors(error, "An Error Has Occured");
              //GenericModal.showModal('Error', errorFactory.getErrorMessage(error.message));
              $scope.$apply();
          });
}

$scope.cancel = function () {
  $uibModalInstance.dismiss('cancel');
};


$scope.checkIfJoin = function () {
        if ($scope.payment != '' && $scope.errormsg == '' && $scope.selectedCurrencyType != null) {
        $scope.showJoinBtn = true;
    }
        
    }
  }]);

LeagueInfo.controller('JoinedLeagueMaxTimesInstanceController', ['$scope', '$uibModalInstance', 'clientFactory', '$filter', 'errorFactory', function ($scope, $uibModalInstance, clientFactory, $filter, errorFactory) {
    $scope.leagueTeamID = null;
    
    clientFactory.accounts().GetActiveFantasyLeaguesForAccount(clientFactory.getAccountId())    
    .done(function (activeLeagues) {
        activeLeagues = activeLeagues.filter(function (al) {
            return al.fantasyLeagueID = $scope.id;
        });
        if (activeLeagues.length > 0)
            $scope.leagueTeamID = activeLeagues[0].fantasyTeamID;

        $scope.$apply();
    })
    .fail(function (error) {
        FlowerCityGaming.V1.logMessage(error);
        errorFactory.displayErrors(error, "Error getting Active Fantasy Leagues.");        
        $scope.$apply();
    });

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    
  }]);
