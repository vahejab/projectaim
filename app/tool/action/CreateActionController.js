angular.module('Action').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  }]).controller('CreateActionController', ['$http', '$resource', '$scope', '$window', '$state', '$interval', '$timeout', '$sce', 'CommonService', function($http, $resource, $scope, $window, $state, $interval, $timeout, $sce, CommonService){
         
         $scope.actionitem = {
                actionitemid: '',
                title: '',
                status: (this.completiondate) ? 'Open' : 'Completed',
                criticality: 'None',
                critlevel: 4,
                assignor: 0,
                owner: 0,
                altowner: 0,
                approver: 0,
                assigneddate: '',
                duedate: '',
                ecd: '',
                actionitemtitle: '',
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
        
        $scope.owner = {
            id: '',
            value: ''
        }
        
        $scope.altowner = {
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
        
        $scope.assignors = [];
        $scope.owners = [];
        $scope.altowners = [];
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
                        $scope.assignors.push({id: user.id, value: user.name});
                        $scope.owners.push({id: user.id, value: user.name});
                        $scope.altowners.push({id: user.id, value: user.name});
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
            $scope.actionitem.owner = Number($scope.actionitem.owner);
            $scope.actionitem.altowner = Number($scope.actionitem.altowner);
            $scope.actionitem.assignor = Number($scope.actionitem.assignor);
            //document.write(JSON.stringify($scope.actionitem));
            console.log(JSON.stringify($scope.actionitem));
            $http.post('/api/actionitems', $scope.actionitem).then(function (response){
                if (response.data.Succeeded){
                    $scope.msg = response.data.Result;
                }
                else{
                    console.log(response.data);
                    //$scope.msg = $sce.trustAsHtml(response.data);
                }
            });
        }
        
        $scope.critConfig = {
            view:"richselect",
            //label:"Choose", 
            value:4, 
            options:$scope.critlevels,
            on: {
                "onChange": function getItemValue(id){
                    var obj = this.$eventSource || this;
                    var value = obj.data.value;
                    $scope.actionitem.critlevel = obj.data.value;     
                }     
            }
        }
        
        $scope.titleConfig = {
            view:"text",
            on: {
                "onChange": function getItemValue(id){
                    var obj = this.$eventSource || this;
                    $scope.actionitem.actionitemtitle = obj.data.value;      
                }
            }     
        }
        
        $scope.statementConfig = {
            view:"textarea",
            on: {
                "onChange": function getItemValue(id){
                    var obj = this.$eventSource || this; 
                    $scope.actionitem.actionitemstatement = obj.data.value;      
                }     
            }
        }
        
        $scope.closureCriteriaConfig = {
            view:"textarea" ,
            on: {
                "onChange": function getItemValue(id){
                    var obj = this.$eventSource || this;
                    $scope.actionitem.closurecriteria = obj.data.value;      
                }     
            }
        }
        
        $scope.duedateConfig = {
            view: "datepicker", 
            //value: new Date(), 
            //label: "Select Date", 
            timepicker: false,
            //multiselect: true,
            suggest:{
                type:"calendar", 
                body:{
                    minDate:new Date()
                }
            },      
            on: {
                "onChange": function getItemValue(id){
                    var obj = this.$eventSource || this;
                    $scope.actionitem.duedate = obj.data.value;      
                }     
            }
        }
        
        
        $scope.ecdConfig = {
            view: "datepicker", 
            //value: new Date(), 
            //label: "Select Date", 
            timepicker: false,
            //multiselect: true,
            suggest:{
                type:"calendar", 
                body:{
                    minDate:new Date()
                }
            },      
            on: {
                "onChange": function getItemValue(id){
                    var obj = this.$eventSource || this;
                    //var year = obj.data.value.getYear();
                    //var month = obj.data.value.getMonth();
                    //var day = obj.data.value.getDay();
                    $scope.actionitem.ecd  = obj.data.value;      
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
                              
                              
                                function getAssignorValue(id){
                                            var obj = this.$eventSource || this;
                                            var value = obj.data.value;
                                            scope.actionitem.assignor = obj.data.value;      
                                }
                                
                                function getOwnerValue(id){
                                            var obj = this.$eventSource || this;
                                            var value = obj.data.value;
                                            scope.actionitem.owner = obj.data.value;     
                                }  
                                
                                function getAltOwnerValue(id){
                                            var obj = this.$eventSource || this;
                                            var value = obj.data.value;      
                                            scope.actionitem.altowner = obj.data.value;      
                                }      
                              
                                scope.assignorConfig = {
                                    view:"richselect",
                                    //label:"Choose", 
                                    value:0, 
                                    options:scope.assignors,
                                    on: {
                                        "onChange": getAssignorValue
                                       // "onInit": getAssignorValue
                                    }
                                }
                                
                                scope.ownerConfig = {
                                    view:"richselect",
                                    //label:"Choose", 
                                    value:0, 
                                    options:scope.owners,
                                    on: {
                                        "onChange": getOwnerValue
                                       // "onInit": getOwnerValue
                                    }
                                 }
                                
                                scope.altownerConfig = {
                                    view:"richselect",
                                    //label:"Choose", 
                                    value:0, 
                                    options:scope.altowners,
                                    on: {
                                        "onChange": getAltOwnerValue
                                       // "onInit": getAltOwnerValue
                                    }
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
