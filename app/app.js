/// <reference path="components/myScores/scoreBoard/scoreboardView.html" />
/// <reference path="C:\Users\Jake\Documents\Development\SFLDEV\SFL-Development-Mobile\Partner Websites\knockoutpicks.com\assets/scripts/api/FlowerCityGaming.js" />

var koApp = angular.module('koApp', [
    'ngRoute',
    'AccountController',
    'landingController',
    'AccountOverviewController',
    'CreateALeague',
    'EmailVerifyController',
    'EmailVerifyCallbackController',
    'GameCenterController',
    'LeaderboardsController',
    'LeagueInfo',
    'LineupsController',
    'LobbyFilters',
    'LobbyGridController',
    'RegisterController',
    'ResetPasswordController',
    'SharedDirectives',
    'SharedFilters',
    'ShowLineupLeaguesController',
    'UniversalPlayerSwap',
    'accountLockedController',
    'accountModals',
    'activeLeaguesController',
    'angularModalService',
    'appConfig',
    'bonusController',
    'carousel',
    'changePasswordModalConroller',
    'clientFactory',        
    'currentStandingsController',
    'draftModule',    
    'enterAdditionalLeaguesController',
    'exportLineupsController',
    'fantasyLeagueServices',
    'genericModalService',
    'headerController',
    'importLineupsController',
    'limitedToFreePlayModalController',    
    'locationVerificationController',
    'loginModalController',    
    'myLeaguesFilters',
    'pastLeaguesGridController',
    'profileStatsHeaderDirectives',
    'recentController',
    'referralController',
    'scoreboardController',
    'scoreBoardPreviewController',
    'scoresController',
    'scoresServices',
    'scoringModule',
    'seasonOvrStatsDirectives',
    'sflSockets',
    'sportsScoring',
    'supportModalController',
    'supportSharedPopupController',
    'ticketController',
    'timer',
    'ui.bootstrap',
    'ui.bootstrap.modal',
    'ui.slider',
    'validStatesController',    
    'welcomeModalController',
    'ngAnimate',
    'welcomeVerifiedModalController'
]);





/*
 * Service Registrations
 */

var userLoggedIn = function (clientFactory, accountModalService, $location) {
    //'use strict';
    if (!clientFactory.getAccountId()) {
        $location.path('/lobby');
        accountModalService.displayLoginModal();
    }
};

/*
 * Configurations
 */

koApp.constant("appConstants", {
    "headshotServer": "//az848655.vo.msecnd.net",
    "tenantID": 4,
    "supportEmail": "support@knockoutpicks.com",
    "constants" : FlowerCityGaming.V1.Constants
});

//var sflSockets = angular.module('sflSockets', []);
koApp.config(["websocketCoreProvider", function (websocketCoreProvider) {
    websocketCoreProvider.setServerAddress('ws://192.168.1.2:28181');
}]);

koApp.config(['$routeProvider', '$sceDelegateProvider', 
    function ($routeProvider, $sceDelegateProvider, accountModalService) {
        FlowerCityGaming.V1.IdentityServer.configuration = new FlowerCityGaming.V1.Models.IdentityServerConfiguration(
            'http://idsvr.starfantasyleagues.com',
            'http://localstatic.knockoutpicks.com',
            '/auth_refresh_complete.html',
            900 /* 15 minutes */);



        $sceDelegateProvider.resourceUrlWhitelist([
            // Allow same origin resource loads.
            'self',
            FlowerCityGaming.V1.IdentityServer.configuration.host + '/**'
        ]);



        $routeProvider.
            when('/', {
                redirectTo: '/landing',
                controller: 'landingController',
                title: 'Landing'
                }
        ).
            when('/my-account', {
                templateUrl: 'app/components/account/accountView.html',
                controller: 'AccountController',
                title: 'My Account',
                resolve: {
                    loggedIn: ['clientFactory', 'accountModalService', '$location', userLoggedIn]
                }
            }).
            when('/leaderboards', {
                templateUrl: 'app/components/leaderboards/leaderboardsView.html',
                controller: 'LeaderboardsController',
                title: 'Leaderboards',
                resolve: {
                    loggedIn: ['clientFactory', 'accountModalService', '$location', userLoggedIn]
                }
            }).
            when('/myLeagues', {
                templateUrl: 'app/components/myLeagues/myLeaguesView.html',
                title: 'My Leagues',
                resolve: {
                    loggedIn: ['clientFactory', 'accountModalService', '$location', userLoggedIn]
                }
                                   
            }).
            when('/myLineups', {
                templateUrl: 'app/components/myLineups/myLineupsView.html',
                controller: 'LineupsController',
                title: 'My Lineups',
                resolve: {
                    loggedIn: ['clientFactory', 'accountModalService', '$location', userLoggedIn]
                }
            }).
            when('/myScores', {
                templateUrl: 'app/components/myScores/myScoresView.html',
                controller: 'scoresController',
                resolve: {
                    loggedIn: ['clientFactory', 'accountModalService', '$location', userLoggedIn]
                },
                title: 'My Scores'
            }).
            when('/myScores/scoreboard/:fantasyLeagueID/:fantasyTeamID', {
                templateUrl: 'app/components/myScores/scoreBoard/scoreboardView.html',
                controller: 'scoreboardController',
                resolve: {
                    loggedIn: ['clientFactory', 'accountModalService', '$location', userLoggedIn]
                },
                title: 'Scoreboard'
            }).
            when('/lobby', {
                templateUrl: 'app/components/lobby/lobbyView.html',
                title: 'Lobby'
            }).
            when('/landing', {
                templateUrl: 'app/components/landing/landingView.html',
                controller: 'landingController',
                title: 'Landing',
            }).
            when('/faq', {
                templateUrl: 'app/components/faq/faqView.html',
                title: 'FAQs'
            }).
            when('/how-to-play', {
                templateUrl: 'app/components/howToPlay/how-to-playView.html',
                title: 'How to Play'
            }).
            when('/rules', {
                templateUrl: 'app/components/rules/rulesView.html',
                title: 'Rules'
            }).
            when('/terms-of-use', {
                templateUrl: 'app/components/termsOfUse/termsOfUseView.html',
                title: 'Terms of Use'
            }).
            when('/about-us', {
                templateUrl: 'app/components/aboutUs/aboutUsView.html',
                title: 'About Us'
            }).
            when('/privacy-policy', {
                templateUrl: 'app/components/privacyPolicy/privacyPolicyView.html',
                title: 'Privacy Policy'
            }).
            when('/emailVerify', {
                templateUrl: 'app/components/emailVerify/emailVerify.html',
                controller: 'EmailVerifyController',
                title: 'Email Verify'
            }).
            when('/emailVerifyCallback', {
                templateUrl: 'app/components/emailVerifyCallback/emailVerifyCallback.html',
                controller: 'EmailVerifyCallbackController',
                title: 'Email Verify Callback'
            }).
            when('/resetPassword', {
                templateUrl: 'app/components/resetPassword/resetPassword.html',
                controller: 'ResetPasswordController',
                title: 'Reset Password'
            }).
            when('/banned', {
                templateUrl: 'app/components/account/accountBanned/accountBannedView.html',
                title: 'Banned'
            }).
            when('/invalidLocation', {
                templateUrl: 'app/components/account/invalidLocation/invalidLocationView.html',
                title: 'Invalid Location'
            }).
            when('/accountLocked', {
                templateUrl: 'app/components/account/accountLocked/accountLockedView.html',
                controller: 'accountLockedController',
                title: 'Account Locked'
            }).
            when('/registrationError', {
                templateUrl: 'app/components/account/locationVerificationResult/registrationError/registrationErrorView.html',
                title: 'Registration Error'
            }).
            when('/verificationPending', {
                templateUrl: 'app/components/account/locationVerificationResult/verificationPending/verificationPendingView.html',
                title: 'Verification Pending'
            }).
            when('/invalidLocationProvided', {
                templateUrl: 'app/components/account/locationVerificationResult/invalidLocationProvided/invalidLocationProvidedView.html',
                title: 'Invalid Location Provided'
            }).
            when('/invalidAgeProvided', {
                templateUrl: 'app/components/account/locationVerificationResult/invalidAgeProvided/invalidAgeProvidedView.html',
                title: 'Invalid Age Provided'
            }).
            when('/draft/:leagueID/:fantasyTeamID', {
                templateUrl: 'app/components/draft/draftView.html',
                title: 'Your Lineup',
                resolve: {
                    loggedIn: ['clientFactory', 'accountModalService', '$location', userLoggedIn]
                }
                /*controller: 'draftController'*/
            }).otherwise({
                redirectTo: '/landing',
                controller: 'landingController',
                title: 'Landing'
            });
    }
]);

koApp.run(['$rootScope','appConstants', function ($rootScope, appConstants) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
    $fcgConstants = appConstants.constants;
}]);