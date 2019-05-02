angular.module('Action').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  }]).controller('CreateActionController', ['$http', '$resource', '$scope', '$window', '$state', '$interval', '$timeout', '$sce', 'CommonService', function($http, $resource, $scope, $window, $state, $interval, $timeout, $sce, CommonService){
         $scope.actionitem = {
                actionitemid: '',
                title: '',
                status: (this.completiondate) ? 'Open' : 'Completed',
                criticality: '',
                critlevel: '',
                assignor: '',
                owner: '',
                altowner: '',
                approver: '',
                assigneddate: '',
                duedate: '',
                ecd: '',
                completiondate: '',
                closeddate: '',
                actionitemstatement: '',
                closurecriteria: '',
                ownernotes: '',
                approvercomments: '',
                activitylog: ''
        }  
        
        $scope.assignor = {
            id: '',
            value: ''
        }
        
        $scope.criticality = {
            id: '',
            value: ''
        }
        
        $scope.config = {
            view: 'layout',
            responsive: true
        }
        
        $scope.users = [];
        $scope.owner = {};
        $scope.altowner = {};
        $scope.assignor = {};
        $scope.minDate = null;
        
        $scope.critlevels = 
        [
          {id: 1, value: 'High'},
          {id: 2, value: 'Med'},
          {id: 3, value: 'Low'},
          {id: 4, value: 'None'} 
        ];   
          
        $scope.getUsers = function(){
            return $scope.users;  
        };
        
        $scope.getMinDate = function(){  
            return $scope.minDate;
        }
        
        $scope.getCrticalities = function(){
            return $scope.criricalitylevels;
        }                       
             
        $scope.init = function(){
            CommonService.initTableScrolling();
            return $http.get('api/users').then(function(response){
                if (response.data.Succeeded){
                    
                    $.each(response.data.Result, function(key, user){
                        $scope.users.push({id: user.id, value: user.name});
                    }); 
                     
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

        
        $scope.critConfig = {
            view:"richselect",
            //label:"Choose", 
            value:1, 
            options:$scope.critlevels
        }
        
        $scope.dateConfig = {
            view: "datepicker", 
            value: new Date(), 
            //label: "Select Date", 
            timepicker: false,
            //multiselect: true,
            suggest:{
                type:"calendar", 
                body:{
                    minDate:new Date
                }
            }
        }
                       
        $scope.today = new Date()

        this.duedate = new Date();
        this.ecd = new Date();
        this.isOpen = false;
  }]).directive('initData', function(){                     
                  return {
                        restrict: 'E',
                        link: function (scope, element, attrs) {
                              scope.init().then(function(){
                              
                                scope.userConfig = {
                                    view:"richselect",
                                    //label:"Choose", 
                                    value:1, 
                                    options:scope.users
                                }
                                
                                webix.ready(function(){
                                    webix.ui({
                                      container:"formcontainer"
                                    })
                                });
                              });     
                              
                        }
                  }
        });
