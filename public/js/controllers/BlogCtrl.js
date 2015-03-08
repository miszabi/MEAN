angular.module('BlogCtrl', []).controller('BlogController', function($scope, BlogService){
	$scope.tagline = 'Welcome to miszabi blog';

	BlogService.get().then(function (result) {
		//success
		$scope.articles = result.data;
	}, function () {
		//error
		alert('cpould not load blogs');
	});
});