angular.module('Action').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  }]).controller('CreateActionController', ['$http', '$resource', '$scope', '$window', '$state', '$interval', '$timeout', '$sce', 'CommonService', function($http, $resource, $scope, $window, $state, $interval, $timeout, $sce, CommonService){
         refresh = false;
         
         $scope.actionitem = {
                actionitemid: '',
                title: '',
                status: (this.completiondate) ? 'Open' : 'Completed',
                criticality: '',
                critlevel: '',
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
            return $http.get('api/users').then(function(response){
                if (response.data.Succeeded){
                
                   for (var key = 0; key < response.data.Result.length; key++){
                        user = response.data.Result[key];     
                        $scope.assignors.push({id: user.id, value: user.name});
                        $scope.owners.push({id: user.id, value: user.name});
                        $scope.altowners.push({id: user.id, value: user.name});
                   }
            
                   return response.data.Result;
                }
                else{
                     $scope.msg = $sce.trustAsHtml(response.data);
                }
            }); 
        }
        
        $scope.clearValidation = function(id){
            (document.querySelector('#'+id+' > div.webix_control')).classList.remove("webix_invalid");
        }
        
        $scope.validate = function(id){
           (document.querySelector('#'+id+' > div.webix_control')).classList.add("webix_invalid");
        }
               

        $scope.validateAll = function(){
        
               (document.querySelector('#assignor > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#duedate > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#ecd > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#criticality > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#owner > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#altOwner > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#actionitemtitle > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#actionitemstatement > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#closurecriteria > div.webix_control')).classList.remove("webix_invalid");
        
              
               if ($scope.actionitem.assignor == 0) (document.querySelector('#assignor > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.duedate == '') (document.querySelector('#duedate > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.ecd == '' )   (document.querySelector('#ecd > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.critlevel == 0) (document.querySelector('#criticality > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.owner == 0 ) (document.querySelector('#owner > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.altowner == 0 ) (document.querySelector('#altOwner > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.actionitemtitle.trim() == '' )  (document.querySelector('#actionitemtitle > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.actionitemstatement.trim() == '')  (document.querySelector('#actionitemstatement > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.closurecriteria.trim() == '') (document.querySelector('#closurecriteria > div.webix_control')).classList.add("webix_invalid");
        
        }
        
        $scope.valid = function(){
            return($scope.actionitem.assignor != 0 &&
                   $scope.actionitem.duedate != '' &&
                   $scope.actionitem.ecd != '' &&
                   $scope.actionitem.critlevel != 0 &&
                   $scope.actionitem.owner != 0 &&
                   $scope.actionitem.altowner != 0 &&
                   $scope.actionitem.actionitemtitle.trim() != '' &&
                   $scope.actionitem.actionitemstatement.trim() != '' &&
                   $scope.actionitem.closurecriteria.trim() != '');
        };

        $scope.split = function(str, delimit) {
            var array = str.split(str, delimit);
            return array;
        }

        $scope.submit = function(){
        
            $scope.validateAll();
            if (!$scope.valid())
                 $scope.msg = "Please complete form and resubmit";
            else 
                //$scope.actionitem.duedate = $scope.split($scope.actionitem.duedate,'T')[0];
                //$scope.actionitem.ecd = $scope.split($scope.actionitem.ecd, 'T')[0];
              
                $http.post('/api/actionitems', $scope.actionitem).then(function (response){
                    if (response.data.Succeeded){
                        $scope.msg = response.data.Result;
                    }
                    else{
                        $scope.msg = $sce.trustAsHtml(response.data);
                    }
                }); 
        }
        
     

        $scope.date = function(){
            return CommonService.formatDate(new Date());
        }
        

        $scope.$on("$destroy", function(){
             angular.element(document.querySelector('link[href="/app/tool/action/CreateActionItem.css"]')).remove();
        });
             
        
                       
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
                                            scope.actionitem.assignor = angular.element(document.querySelector('#'+id)).value.toString();      
                                }
                                
                                function getOwnerValue(id){   
                                            scope.actionitem.owner = angular.element(document.querySelector('#'+id)).value.toString();  
                                }                                                                           
                                
                                function getAltOwnerValue(id){     
                                            scope.actionitem.altowner = angular.element(document.querySelector('#'+id)).value.toString();      
                                }
                                
                                webix.ready(function(){
                                    webix.ui.fullScreen();
                                });
                                
                                scope.assignorConfig = {
                                    view:"richselect",
                                    //label:"Choose", 
                                    value:0, 
                                    options:scope.assignors,
                                    on: {
                                        "onItemClick": function(){
                                        var obj = this.eventSource || this;  
                                          var value = obj.data.value.toString();
                                          if (!obj.data.value)
                                               return;
                                          getAssignorValue('assignor');
                                          scope.clearValidation('assignor');
                                          if (value.trim() == '')
                                            scope.validate('assignor');
                                        },
                                        "onBlur": function getItemValue(id){
                                            var obj = this.eventSource || this;
                                             scope.validate('assignor');
                                            if (!obj.data.value)
                                               return;
                                            var value = obj.data.value;
                                            scope.actionitem.assignor = obj.data.value;
                                            scope.clearValidation('assignor');
                                            if (value.critlevel == 0)
                                                scope.validate('assignor');     
                                        },
                                        "onChange": function (){
                                            scope.clearValidation('assignor');
                                        }
                                       // "onInit": getAssignorValue
                                    },
                                    responsive: true,
                                    width: "200",
                                    height: "30",
                                    validate: webix.rules.isSelected,
                                    required: true
                                }
                                
                                scope.ownerConfig = {
                                    view:"richselect",
  
                                    //label:"Choose", 
                                    value:0, 
                                    options:scope.owners,
                                    on: {
                                        "onItemClick": function(){
                                          var obj = this.eventSource || this;
                                          if (!obj.data.value)
                                               return;
                                          var value = obj.data.value.toString();
                                          getOwnerValue('owner');
                                          scope.clearValidation('owner');
                                          if(value.trim == '')
                                            scope.validate('owner');
                                        },
                                        "onBlur": function getItemValue(id){
                                            var obj = this.eventSource || this;
                                             scope.validate('owner');
                                            if (!obj.data.value)
                                               return;
                                            var value = obj.data.value;
                                            scope.actionitem.owner = obj.data.value;
                                            scope.clearValidation('owner');
                                            if (value.critlevel == 0)
                                                scope.validate('owner');     
                                        },
                                        "onChange": function (){
                                           var obj = this.eventSource || this;
                                          if (obj.data.value.critlevel != 0)
                                            scope.clearValidation('owner');
                                        }
                                       // "onInit": getOwnerValue
                                    },  
                                    responsive: true,
                                    width: "200",
                                    height: "30",
                                    validate: webix.rules.isSelected,
                                    required: true
                                 }
                                
                                scope.altownerConfig = {
                                    view:"richselect",
                                    //label:"Choose", 
                                    value:0, 
                                    options:scope.altowners,
                                    on: {
                                        "onItemClick": function(){
                                          var obj = this.eventSource || this;
                                          if (!obj.data.value)
                                               return; 
                                          var value = obj.data.value.toString();
                                          getAltOwnerValue('altOwner');
                                          scope.clearValidation('altOwner');
                                          if(value.trim == '')
                                            scope.validate('altOwner');
                                        },
                                        "onBlur": function getItemValue(id){
                                            var obj = this.eventSource || this;
                                             scope.validate('altOwner');
                                            if (!obj.data.value)
                                               return;
                                            var value = obj.data.value;
                                            scope.actionitem.altowner = obj.data.value;
                                            scope.clearValidation('altOwner');
                                            if (value.critlevel == 0)
                                                scope.validate('altOwner');     
                                        },
                                        "onChange": function (){
                                            var obj = this.eventSource || this;
                                            scope.validate('altOwner');
                                            if (obj.data.value.critlevel != 0)
                                                scope.clearValidation('altOwner');
                                        }
                                       // "onInit": getAltOwnerValue
                                    },
                                    responsive: true,
                                    width: "200",
                                    height: "30",
                                    validate: webix.rules.isSelected,
                                    required: true
                                }
                                
                                scope.critConfig = {
                                    view:"richselect",
                                    value:0, 
                                    options:scope.critlevels,
                                    on: {
                                        "onItemClick": function getItemValue(id){
                                            var obj = this.eventSource || this;
                                            var value = obj.data.value;
                                            scope.actionitem.critlevel = obj.data.value;
                                            scope.clearValidation('criticality');
                                            if (value.critlevel == 0)
                                                scope.validate('criticality');     
                                        },
                                        "onBlur": function getItemValue(id){
                                            var obj = this.eventSource || this;
                                             scope.validate('criticality');
                                            if (!obj.data.value)
                                               return;
                                            var value = obj.data.value;
                                            scope.actionitem.critlevel = obj.data.value;
                                            scope.clearValidation('criticality');
                                            if (value.critlevel == 0)
                                                scope.validate('criticality');     
                                        },
                                        "onChange": function (){
                                            var obj = this.eventSource || this;
                                            scope.validate('criticality');
                                            if (obj.data.value.critlevel != 0)
                                                scope.clearValidation('criticality');
                                        }
                                    }, 
                                    responsive: true,
                                    width: "200",
                                    height: "30",
                                    validate: webix.rules.isSelected,
                                    required: true
                                }
                                
                                scope.titleConfig = {
                                    view:"text",
                                    value: scope.actionitem.actionitemtitle,      
                                    on: {
                                        "onBlur": function(){  
                                             var obj = this.eventSource || this;  
                                             var value = obj.data.value;
                                             scope.actionitem.actionitemtitle = value;       
                                             scope.clearValidation('actionitemtitle');
                                             if (value.trim() == '')
                                                scope.validate('actionitemtitle');
                                        }
                                    },
                                   
                                    responsive: true,
                                    width: "550",
                                    height: "30",
                                    validate: webix.rules.isNotEmpty,
                                    required: true
                                }
                                
                                scope.statementConfig = {
                                    view:"textarea",
                                    value: scope.actionitem.actionitemstatement, 
                                    on: {                                  
                                        "onBlur": function(){
                                            var obj = this.eventSource || this;
                                            var value = obj.data.value.toString();
                                            scope.actionitem.actionitemstatement = value;
                                            scope.clearValidation('actionitemstatement');
                                            if (value.trim() == '')
                                                scope.validate('actionitemstatement');
                                        }
                                    },
                                    responsive: true,
                                    width: "550",
                                    height: "97",
                                    validate: webix.rules.isSelected,
                                    required: true
                                }
                                
                                scope.closureCriteriaConfig = {
                                    view:"textarea",
                                    value: scope.actionitem.closurecriteria, 
                                    on: {
                                        "onBlur": function(){
                                             var obj = this.eventSource || this;  
                                             var value = obj.data.value.toString(); 
                                             scope.actionitem.closurecriteria = value;       
                                             scope.clearValidation('closurecriteria');
                                             if (value.trim() == '')
                                                scope.validate('closurecriteria');
                                        }
                                    }, 
                                    responsive: true,
                                    width: "550",
                                    height: "97",
                                    validate: webix.rules.isSelected,
                                    required: true
                                }
                                
                                scope.duedateConfig = {
                                    view: "datepicker", 
                                    //value: $scope.date(), 
                                    timepicker: false,
                                    //multiselect: true,
                                    suggest:{
                                        type:"calendar", 
                                        body:{
                                            minDate:new Date()
                                        }
                                    },      
                                    on: {
                                        "onItemClick": function (id){
                                            var obj = this.eventSource || this;
                                            if (!obj.data.value)
                                               return;  
                                            var value = obj.data.value.toString();
                                            var year = obj.data.value.getFullYear();
                                            var month = obj.data.value.getMonth();
                                            var day = obj.data.value.getDay();
                                            scope.actionitem.duedate = year + "-" + ((month < 10)? '0'+month: month) + "-" + ((day < 10)? '0'+day: day);        
                                            scope.clearValidation('duedate');
                                           // scope.validate(scope.actionitem.duedate, 'duedate');
                                        },
                                        "onBlur": function (){
                                            var obj = this.eventSource || this;
                                            scope.validate('duedate');
                                            if (!obj.data.value)
                                               return;
                                            var value = obj.data.value;
                                            var year = obj.data.value.getFullYear();
                                            var month = obj.data.value.getMonth()+1;
                                            var day = obj.data.value.getDay();
                                            scope.actionitem.duedate  = year + "-" + ((month < 10)? '0'+month: month) + "-" + ((day < 10)? '0'+day: day);     
                                            scope.clearValidation('duedate');
                                            //scope.validate(scope.actionitem.ecd, 'ecd');
                                        }        
                                    },   
                                    responsive: true,
                                    width: "200",                       
                                    height: "30",
                                    validate: webix.rules.isSelected,
                                    required: true
                                }
                                        
                                 
                                 
                                scope.ecdConfig = {
                                    view: "datepicker", 
                                    //value: scope.date(),
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
                                        "onItemClick": function (id){
                                            var obj = this.eventSource || this;
                                            if (!obj.data.value)
                                               return;
                                            var value = obj.data.value;
                                            var year = obj.data.value.getFullYear();
                                            var month = obj.data.value.getMonth()+1;
                                            var day = obj.data.value.getDay();
                                            scope.actionitem.ecd  = year + "-" + ((month < 10)? '0'+month: month) + "-" + ((day < 10)? '0'+day: day);     
                                            scope.clearValidation('ecd');
                                            //scope.validate(scope.actionitem.ecd, 'ecd');
                                        },
                                        "onBlur": function (){
                                            var obj = this.eventSource || this;
                                            scope.validate('ecd');
                                            if (!obj.data.value)
                                               return;
                                            var value = obj.data.value;
                                            var year = obj.data.value.getFullYear();
                                            var month = obj.data.value.getMonth()+1;
                                            var day = obj.data.value.getDay();
                                            scope.actionitem.ecd  = year + "-" + ((month < 10)? '0'+month: month) + "-" + ((day < 10)? '0'+day: day);     
                                            scope.clearValidation('ecd');
                                            //scope.validate(scope.actionitem.ecd, 'ecd');
                                        }   
                                    },
                                    responsive: true,
                                    width: "200",
                                    height: "30",
                                    validate: webix.rules.isSelected,
                                    required: true
                                }
                        });     
                              
                  }
          }
});
