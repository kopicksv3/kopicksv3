var changePasswordModalConroller = angular.module('changePasswordModalConroller', []);
changePasswordModalConroller.controller('changePasswordModalConroller', ['$scope', 'clientFactory', '$routeParams', '$location', function ($scope, clientFactory, $routeParams, $location) {
    var passwordChangeUrl = FlowerCityGaming.V1.IdentityServer.preparePasswordChangeUrl(clientFactory.getAccountId());

    document.getElementById('changePasswordInnerFrame').onload = function () {
        $('#changePasswordInnerFrame').iFrameResize();
    };

    $scope.passwordChangeUrl = passwordChangeUrl;
}]);