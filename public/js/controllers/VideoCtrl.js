angular.module('VideoCtrl', []).controller('VideoController', function($scope, $window, BlogService){
	$scope.currentUrl = $window.location.href;
});