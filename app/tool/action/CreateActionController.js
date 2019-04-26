angular.module('Action').config([
  '$stateProvider', 
  '$urlRouterProvider', 
  function($stateProvider, $urlRouterProvider) {
  
  }]).decorator('CreateActionDecorator', function(){
    

  }).controller('CreateActionController', ['$http', '$resource', '$scope', '$window', '$state', '$timeout', function($http, $resource, $scope, $window, $state, $timeout){
        
        
        $scope.actionitem = {
            assignor: '', 
            dueDate: '',
            ecd: '',
            criticality: '',
            owner: '',
            altOwner: '',
            title: '',
            statement: '',
            closurecriteria: ''
        };

        $scope.users = {};
        $scope.usr = {};
        $scope.minDate = null;
        
        $scope.criticalitylevels = [];   
          
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

        $scope.valid = function(){
        
            alert( $scope.actionitem.assignor != '' &&
                   $scope.actionitem.dueDate != '' &&
                   $scope.actionitem.ecd != '' &&
                   $scope.actionitem.criticality != '' &&
                   $scope.owner != '' &&
                   $scope.altOwner != '' &&
                   $scope.title.trim() != '' &&
                   $scope.statement.trim() != '' &&
                   $scope.closureCriteria.trim() != '');
        };

        $scope.submit = function(){
            alert(JSON.stringify($scope.actionitem));
            //$http.post('api/actionitem', )
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
