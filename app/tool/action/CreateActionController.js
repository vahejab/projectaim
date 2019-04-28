angular.module('Action').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  }]).controller('CreateActionController', ['$http', '$resource', '$scope', '$window', '$state', '$timeout', '$sce', function($http, $resource, $scope, $window, $state, $timeout, $sce){
        $scope.actionitem = {
            assignor: '', 
            duedate: '',
            ecd: '',
            critlevel: '',
            criticality: '',
            owner: '',
            altowner: '',
            actionitemtitle: '',
            actionitemstatement: '',       
            closurecriteria: ''
        };

        $scope.users = [];
        $scope.owner = {};
        $scope.altowner = {};
        $scope.assignor = {};
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
                if (response.data.Succeeded){
                    $scope.users = response.data.Result;
                    return response.data.Result;
                }
                if (!response.data.Succeeded){
                    $scope.msg = $sce.trustAsHtml(response.data.Result);
                }
            }); 
        } 

        $scope.valid = function(){
        
            alert( $scope.actionitem.assignor != '' &&
                   $scope.actionitem.duedate != '' &&
                   $scope.actionitem.ecd != '' &&
                   $scope.actionitem.criticality != '' &&
                   $scope.actionitem.owner != '' &&
                   $scope.actionitem.altowner != '' &&
                   $scope.actionitemtitle.trim() != '' &&
                   $scope.actionitemstatement.trim() != '' &&
                   $scope.closurecriteria.trim() != '');
        };

        $scope.split = function(str, delimit) {
            var array = str.split(delimit);
            return array;
        }

        $scope.submit = function(){
            $scope.actionitem = JSON.parse(JSON.stringify($scope.actionitem));
            $scope.actionitem.duedate = $scope.split($scope.actionitem.duedate,'T')[0];
            $scope.actionitem.ecd = $scope.split($scope.actionitem.ecd, 'T')[0];
            $scope.actionitem.criticality = $scope.actionitem.critlevel.value;
            $http.post('/api/actionitems', JSON.stringify($scope.actionitem)).then(function (response){
                if (response.data.Succeeded){
                    $scope.msg = response.data.Result;
                }
                else if (!response.data.Succeeded){
                    $scope.msg = $sce.trustAsHtml(response.data.Result);
                }
            });
        }

        $scope.today = new Date()
       
        this.duedate = new Date();
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
