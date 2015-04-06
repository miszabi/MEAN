angular.module('EditArticleCtrl', []).controller('EditArticleController', function($scope, $routeParams, $window, BlogService){

    $scope.save = function(article){

        if(article._id === undefined || article._id == '' ){
            console.log('post a new article');
            BlogService.post(article);

          } else {
              BlogService.put(article);
          }
            $window.location = '#/blog';
    };

    if($routeParams.id != undefined){
        $scope.title = 'Edit article';

        BlogService.getById($routeParams.id)
            .then(function(result){
                $scope.article = result.data;
            },
            function(){ //error
         });
    } else {
        $scope.title = 'Create a new article';

        //new article
        $scope.article = {title: '', body: '', _id: 0};
        console.log('try to create a new article');
    }
});