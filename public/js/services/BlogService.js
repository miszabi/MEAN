angular.module('BlogService', []).factory('BlogService',['$http', '$q', function($http, $window, $q){
			
	return {

		authenticate: function(loginModel){
			return $http.post('api/authenticate', loginModel);
		},

		isAuthenticated : function(){
			return $http.get('api/authenticate');
		},

		logout: function(){
			return $http.post('api/logout');
		},

		get : function(){
			return $http.get('api/blogs');
		},

		getById : function(id){
			return $http.get('api/blogs/'+id);
		},

		post : function (blogData){
			return $http.post('api/blogs', blogData);
		},

		put : function (blogData){
			return $http.put('api/blogs', blogData);
		},

		remove : function (id){
			return $http.delete('api/blogs/'+ id);		
		},

		commentArticle : function(comment){
			//console.log('try to save comment');
			return $http.post('api/comment', comment);
		}


	};
}]);