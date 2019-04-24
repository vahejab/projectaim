angular.module('Action').config([
  '$stateProvider', 
  '$urlRouterProvider', 
  function($stateProvider, $urlRouterProvider) {
  
  }]).controller('CreateActionController', ['$http', '$resource', '$scope', '$state', '$timeout', function($http, $resource, $scope, $state, $timeout){
        
        $scope.users = {};
        $scope.user = {};
        $scope.usr = {};
        
        $scope.init = function()
        {
          return $http.get('api/users').then(function(response){
               $scope.users = response.data;
               return response.data;
          });  
        } 
        
        this.minDate = new Date();
        this.myDate = new Date();
        this.isOpen = false;
}]);
