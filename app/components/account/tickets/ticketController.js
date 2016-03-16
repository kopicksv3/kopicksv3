var ticket = angular.module('ticketController', []);

ticket.controller('ticketController', ['$scope', 'clientFactory', function ($scope, clientFactory) {
    //'use strict';
    angular.element(document).ready(function () {

        $scope.ActiveTickets = [];
        $scope.RedeemedTickets = [];
        $scope.ExpiredTickets = [];

        clientFactory.accounts().GetAccountTickets(clientFactory.getAccountId())
        .done(function (ticketdata) {
            $scope.TicketData = ticketdata;
            var dt = new Date();  
            for (var i = 0 ; i < ticketdata.length; i++)
            {
                if (ticketdata[i].isRedeemed == 'true')
                {
                    $scope.RedeemedTickets.push[ticketdata[i]];
                }
                else if (ticketdata[i].expiresDate != null)
                {
                    var edt = new date(ticketdata[i].expiresDate);
                    if (dt > edt)
                        $scope.ExpiredTickets.push[ticketdata[i]];
                }
                else
                {
                    $scope.ActiveTickets.push[ticketdata[i]];
                }
        
            }

        })
        .fail(function (error) {
            FlowerCityGaming.V1.logError("Error loading fantasy leagues");
        });

        /*
        var d = new Date();
        var curYear = d.getFullYear();
        

        $scope.Years = [];
        for (var i = 2012; i <= curYear; i++) {
            $scope.Years.push(i.toString())
        }

         
        clientFactory.accounts().GetAccountReferrals(clientFactory.getAccountId(), d.getMonth(), d.getFullYear())
        .done(function (referralinfo) {

            $scope.ReferralInfo = referralinfo;
            //FlowerCityGaming.V1.logMessage($scope.AccountInfo.addresses.length);
            $scope.$apply();

        })
        .fail(function (error) {
            FlowerCityGaming.V1.logError("Error loading fantasy leagues");
        });

        */

    });
}]);