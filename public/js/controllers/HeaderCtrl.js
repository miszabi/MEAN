angular.module('HeaderCtrl',[]).controller("HeaderController", function($scope, $rootScope, $location){
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
    $scope.authenticatedUser = function (){
        var accountName = $rootScope.accountName;
        return  accountName ?  accountName : '';
    };

    $scope.isAuthenticated =  function (){
        return $rootScope.authenticated;
    }
});