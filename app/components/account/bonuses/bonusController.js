var bonus = angular.module('bonusController', []);

bonus.controller('bonusController', ['$scope', 'clientFactory', function ($scope, clientFactory) {
    //'use strict';
    angular.element(document).ready(function () {


        $scope.UserHasBonus = false;
        clientFactory.accounts().GetAccountBonusDataByPromoID(clientFactory.getAccountId())
        .done(function (bonusdata) {

            if (bonusdata.promoID != 0) {

                $scope.BonusData = bonusdata;
                $scope.BonusData.percentCleared = $scope.BonusData.percentCleared * 100;
                $scope.UserHasBonus = true;

                $scope.GetBonusDetail(bonusdata.promoID);

                //FlowerCityGaming.V1.logMessage($scope.AccountInfo.addresses.length);
                //$scope.$apply();

                //  this.accountID = accountID;
                //       this.promoID = promoID;
                //       this.promoCode = promoCode;
                //      this.status = status;
                //       this.statusID = statusID;
                //       this.initialBonus = initialBonus;
                //       this.currentBalance = currentBalance;
                //       this.amountCleared = amountCleared;
                //       this.bonusStartDate = bonusStartDate;
                //       this.bonusEndDate = bonusEndDate;
                //       this.percentCleared = percentCleared;
                //       this.daysRemaining = daysRemaining;
                //       this.daysRemainingInt = daysRemainingInt;
                //       this.releaseRate = releaseRate;
                //       this.releaseBalance = releaseBalance;
                //       this.cancelOnWithdraw = cancelOnWithdraw;
                //       this.bonusPercent = bonusPercent;
                //       this.instantStarPoints = instantStarPoints;
                //       this.clearanceRate = clearanceRate;
                //       this.maxAward = maxAward;

                //  1	Active
                //   2	Completed
                //   3	Cancelled  | date: "MM/dd/yyyy"    | currency    {{detdata.description}}  {{detdata.value}}  {{detdata.dateOccurred }}
                //   4	Paused
                //   5	Expired
                //   6	DeferredUntilFirstDeposit
            }
        })
        .fail(function (error) {
            FlowerCityGaming.V1.logError("Error loading bonus data");
        });

        
        $scope.GetBonusDetail = function (promoid) {
           
            clientFactory.accounts().GetAccountBonusDetailsByPromoID(clientFactory.getAccountId(), promoid)
                .done(function (bonusdetaildata) {
                    $scope.BDetData = bonusdetaildata;
                    $scope.$apply();
                  
                })
               .fail(function (error) {
                   FlowerCityGaming.V1.logError("Error loading bonus detail");
            });
        };
         
    });
}]);