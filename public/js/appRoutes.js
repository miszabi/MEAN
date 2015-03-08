angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

	$routeProvider

		.when('/', {
			templateUrl:'views/home.html',
			controller:'MainController'
		})

		.when('/blog',{
			templateUrl: 'views/blog.html',
			controller : 'BlogController'
		})

		.when('/edit-article/:id',{
			templateUrl: 'views/edit-article.html',
			controller : 'EditArticleController'
		})

		.when('/new-article',{
			templateUrl: 'views/edit-article.html',
			controller : 'NewArticleController'
		})

		.when('/login',{
			templateUrl: 'views/login.html',
			controller : 'LoginController'
		})

		.when('/logout',{
			templateUrl: 'views/login.html',
			controller : 'LoginController'
		})
		
		.when('/about',{
			templateUrl: 'views/about.html',
			controller : 'AboutController'
		})

		.otherwise ({
			redirectTo: '/login'
		});

	$locationProvider.html5Mode(false);

}]).run(function($rootScope, $location, $window, BlogService){
		$rootScope.$on('$routeChangeStart', function(event, next, current){
			$rootScope.authenticated = false;

			if($window.sessionStorage["userInfo"]){
				var accountUser = JSON.parse($window.sessionStorage["userInfo"]);
				if(accountUser.accesToken) {
					$rootScope.authenticated = true;
					$rootScope.accountName = accountUser.name;
					return;
				}
			}
			BlogService.isAuthenticated().then(function(result){

				if(result.data && result.data.isAuthenticated){
					$rootScope.authenticated = true;
					$rootScope.accountName = result.data.name;
				} else {
					var nextUrl = next.$$route.originalPath;
					if (nextUrl == '/signup' || nextUrl == '/login') {

					} else {
						$location.path("/login");
					}
				}
			}, function(){
			});
	});
});