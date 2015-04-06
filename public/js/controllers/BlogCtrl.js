angular.module('BlogCtrl', []).controller('BlogController', function($scope, $window, BlogService){
	$scope.comment  = {
		body : '',
		date : '',
		_id : '',
		userName : ''
	};

	$scope.resetCommentModel = function(){
		$scope.comment = {
			body : '',
			date : '',
			_id : '',
			userName : ''
		};
	};

	$scope.save = function(articleId, comment){
		BlogService.commentArticle({articleId : articleId, userName : comment.userName, body : comment.body});
		$window.location.reload();
	};

	BlogService.get().then(function (result) {
		//success
		$scope.articles = result.data;
	}, function () {
		///TODO handle error
	});
});