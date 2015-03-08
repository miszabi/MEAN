angular.directive('href-if', function(flag){
   if(flag){
       return {template : 'asd'};
   }else {
       return {template : ''}
   }
});