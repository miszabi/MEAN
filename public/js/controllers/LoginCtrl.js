angular.module('LoginCtrl', []).controller('LoginController', function($scope, $window, BlogService){
	$scope.loginModel = {};

	BlogService.logout();
	$window.sessionStorage.clear();

	setTimeout(function(){ $window.location = '#/login'}, 100);

	$scope.authenticate = function(loginModel){

		BlogService.authenticate(loginModel)
			.then(function(result){
				if(result.data != null){
					var userInfo = {
						accesToken : result.data._id,
						name : result.data.firstName + ' ' + result.data.lastName
					};

					$window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
					$window.location = '#/blog';
				}
			},
			function (){
				$window.location = '#/login';
			});
	};
});