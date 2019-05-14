angular.module('Action').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  }]).controller('CreateActionController', ['$http', '$resource', '$scope', '$window', '$state', '$interval', '$timeout', '$sce', 'CommonService', function($http, $resource, $scope, $window, $state, $interval, $timeout, $sce, CommonService){
         refresh = false;
         
         $scope.actionitem = {
                actionitemid: '',
                status: (this.completiondate) ? 'Open' : 'Completed',
                criticality: 0,
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
        
        $scope.approver = {
            id: '',
            value: ''
        }

        $scope.criticality = {
            id: '',
            value: ''
        }
  
    
        $scope.users = [];
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
                        $scope.users.push({id: user.id, value: user.name});
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
        
        $scope.validate = function(elem, id){
           if (typeof elem == 'undefined' || elem == 0 || elem == '' || elem.trim() == '') (document.querySelector('#'+id+' > div.webix_control')).classList.add("webix_invalid");
        }
               

        $scope.validateAll = function(){
        
               (document.querySelector('#assignor > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#duedate > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#ecd > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#criticality > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#owner > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#altowner > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#actionitemtitle > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#actionitemstatement > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#closurecriteria > div.webix_control')).classList.remove("webix_invalid");
               
               if ($scope.actionitem.assignor == 0) (document.querySelector('#assignor > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.duedate == '') (document.querySelector('#duedate > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.ecd == '' )   (document.querySelector('#ecd > div.webix_control')).classList.add("webix_invalid");
               if (typeof $scope.actionitem.critlevel === 'undefined') (document.querySelector('#criticality > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.owner == 0 ) (document.querySelector('#owner > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.altowner == 0 ) (document.querySelector('#altowner > div.webix_control')).classList.add("webix_invalid");
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
        
        $scope.getDateValueAndValidate = function(obj, model, field){
            CommonService.getDateValue(obj, model, 'actionitem', field);       
            $scope.clearValidation(field);
        }               
                                
        $scope.getItemValueAndValidate = function(obj, model, field){
            CommonService.getItemValue(obj, model, 'actionitem', field);         
            $scope.clearValidation(field);   
        }
        
        $scope.getItemId = function(obj, model, field){
            CommonService.getItemId(obj, model, 'actionitem', field);       
        }
        
        $scope.getTextValueAndValidate = function(obj, model, field){
            CommonService.getTextValue(obj, model, 'actionitem', field); 
            $scope.clearValidation(field);  
        }

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
        
  }]);
