/// <reference path="C:\Users\Jake\Documents\Development\SFLDEV\SFL-Development-Mobile\Partner Websites\knockoutpicks.com\assets/scripts/api/FlowerCityGaming.js" />

var clientFactory = angular.module('clientFactory', []);

clientFactory.factory('clientFactory', function () {
    //'use strict';
    //
    // Calling FlowerCityGaming.V1.getClient() will maintain a singleton pattern of Client
    var fcgClient = FlowerCityGaming.V1.getClient(FlowerCityGaming.V1.Constants.ClientConstants.ClientType.Mock, false);

    return fcgClient;
});
