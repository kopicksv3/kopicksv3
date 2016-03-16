var referral = angular.module('referralController', []);

referral.controller('referralController', ['$scope', 'clientFactory', function ($scope, clientFactory) {
    //'use strict';
    angular.element(document).ready(function () {

        var d = new Date();        
        $scope.curYear = d.getFullYear();
        $scope.curMonth = d.getMonth();
             
        $scope.Years = [];
        var i;
        for (i = 2012; i <= $scope.curYear; i++) {
            $scope.Years.push(i.toString());
        }
         
        $scope.predicate = 'date';
        $scope.reverse = true;
        $scope.ReferralTotal = 0;
        $scope.ReferralTotalThisMonth = 0;

        clientFactory.accounts().GetAccountReferrals(clientFactory.getAccountId())
        .done(function (referralinfo) {

            $scope.ReferralInfoCopy = referralinfo;
            $scope.ReferralInfo = referralinfo;

            $scope.ReferralTotal = 0;
            var j;
            for (j = 0; j < $scope.ReferralInfo.length; j++) {
                $scope.ReferralTotal += parseFloat($scope.ReferralInfo[j].totalEarned);

                var dt = new Date($scope.ReferralInfo[j].date);
                if (dt.getFullYear() == $scope.curYear && dt.getMonth() == $scope.curMonth)
                    $scope.ReferralTotalThisMonth += parseFloat($scope.ReferralInfo[j].totalEarned);
            }
            
            $scope.$apply();

        })
        .fail(function (error) {
            FlowerCityGaming.V1.logError("Error loading referral info");
        });
        

        clientFactory.getCachedAccountByID(clientFactory.getAccountId(),false)
        .done(function (cachedacctinfo) {

            $scope.CachedAcctInfo = cachedacctinfo
            $scope.$apply();
        })
        .fail(function (error) {
            FlowerCityGaming.V1.logError("Error loading referral info");
        });

     
        $scope.order = function (predicate) {
            $scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
            $scope.predicate = predicate;
        };

        $scope.CustomFilter = function () {
            
            if ($scope.ddlMonths != "" || $scope.ddlYears != null)
            {
                
                $scope.tmp = [];
                for (var i = 0; i < $scope.ReferralInfoCopy.length; i++) {
                    var dt = new Date($scope.ReferralInfoCopy[i].date);

                    if ($scope.ddlMonths == "")
                    {
                        if(dt.getFullYear() == $scope.ddlYears)
                            $scope.tmp.push($scope.ReferralInfoCopy[i]);
                    }

                    else if ($scope.ddlYears == null) {
                        if (dt.getFullYear() == $scope.curYear && dt.getMonth() == $scope.ddlMonths)
                            $scope.tmp.push($scope.ReferralInfoCopy[i]);
                    }


                    else if(dt.getFullYear() == $scope.ddlYears && dt.getMonth() == $scope.ddlMonths)
                        $scope.tmp.push($scope.ReferralInfoCopy[i]);
                }
                $scope.ReferralInfo = $scope.tmp;
            }
            else
            {
                $scope.ReferralInfo = $scope.ReferralInfoCopy;
            }
        };

       
    });
}]);