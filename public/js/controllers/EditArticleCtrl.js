angular.module('EditArticleCtrl', []).controller('EditArticleController', function($scope, $routeParams, $window, BlogService){
    $scope.title = 'Edit article';

    $scope.save = function(article){

        if(article._id === undefined ){
            BlogService.post(article);

          } else {
              console.log(article);
              BlogService.put(article);
          }
            $window.location = '#/blog';
    };

    BlogService.getById($routeParams.id)
        .then(function(result){
            $scope.article = result.data;
        },
        function(){ //error
     });
});