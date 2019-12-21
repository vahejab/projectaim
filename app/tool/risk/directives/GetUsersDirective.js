angular.module('Risk').directive('getUsers', getUsers); 

function getUsers(){
     return {
            restrict: 'E',
            controller: function ($scope, $element, $attrs, $http, $sce){
     
                 return $http.get('api/users').then(function(response){
                    if (response.data.Succeeded){
                       //ctrl.users.push({id: 0, value: ''});
                       for (var key = 0; key < response.data.Result.length; key++){
                            user = response.data.Result[key];     
                            $scope.ctrl.users[user.id] = {id: user.id, name: user.name};
                       }
                       $scope.ctrl.usersFetched = {done: true};
                       return response.data.Result;
                    }
                    else{
                         $scope.ctrl.msg += "<br />"+ $sce.trustAsHtml(response.data);
                    }
           }); 
          }
     }
}