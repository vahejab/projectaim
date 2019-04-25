angular.module('Action').config([
  '$stateProvider', 
  '$urlRouterProvider', 
  function($stateProvider, $urlRouterProvider) {
  
  }]).controller('CreateActionController', ['$http', '$resource', '$scope', '$window', '$state', '$timeout', function($http, $resource, $scope, $window, $state, $timeout){
        
        $scope.users = {};
        $scope.user = {};
        $scope.usr = {};
        $scope.minDate = null;
        
        $scope.criticalitylevels = [];   
        $scope.criticality = {};
           
        $scope.getUsers = function(){
            return $scope.users;  
        };
        
        $scope.getMinDate = function(){  
            return $scope.minDate;
        }
        
        $scope.getCrticalities = function(){
            return $scope.criricalitylevels;
        }                       
       
        $scope.initUsers = function(){    
            return $http.get('api/users').then(function(response){
                $scope.users = response.data;
                return response.data;
            }); 
        } 
       
        $scope.today = new Date()
       
        this.dueDate = new Date();
        this.ecd = new Date();
        this.isOpen = false;
        
  }]).directive('initData', function(){
          return {
                restrict: 'E',
                link: function (scope, element, attrs) {
                      
                      scope.initUsers();
                      
                      scope.criticalitylevels = 
                      [
                          {'value': 1, 'level': 'High'},
                          {'value': 2, 'level': 'Med'},
                          {'value': 3, 'level': 'Low'},
                          {'value': 4, 'level': 'None'} 
                      ];
                }
          }
});
