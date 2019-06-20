angular.module('Action').config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){
  }]).controller('CreateActionController', ['$http', '$resource', '$scope', '$window', '$state', '$interval', '$timeout', '$sce', 'CommonService', function($http, $resource, $scope, $window, $state, $interval, $timeout, $sce, CommonService){
         refresh = false;
         var ctrl = this;
         ctrl.config = {}
         ctrl.actionitem = {
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
        
        ctrl.assignor = {
            id: '',
            value: ''
        }
        
        ctrl.owner = {
            id: '',
            value: ''
        }
        
        ctrl.altowner = {
            id: '',
            value: ''
        }
        
        ctrl.approver = {
            id: '',
            value: ''
        }

        ctrl.criticality = {
            id: '',
            value: ''
        }
  
    
        ctrl.users = [];
        ctrl.minDate = null;
        
        ctrl.critlevels = 
        [
          {id: 1, value: 'High'},
          {id: 2, value: 'Med'},
          {id: 3, value: 'Low'},
          {id: 4, value: 'None'} 
        ]; 
          
        ctrl.getUsers = function(){
            return ctrl.users;  
        };
        
        ctrl.getMinDate = function(){  
            return ctrl.minDate;
        }
        
        ctrl.getCrticalities = function(){
            return ctrl.criricalitylevels;
        }                       
             
        ctrl.init = function(){
            return $http.get('api/users').then(function(response){
                if (response.data.Succeeded){
                
                   for (var key = 0; key < response.data.Result.length; key++){
                        user = response.data.Result[key];     
                        ctrl.users.push({id: user.id, value: user.name});
                   }
            
                   return response.data.Result;
                }
                else{
                     ctrl.msg = $sce.trustAsHtml(response.data);
                }
            }); 
        }
        
        ctrl.clearValidation = function(id){
            (document.querySelector('#'+id+' > div.webix_control')).classList.remove("webix_invalid");
        }
        
        ctrl.validate = function(elem, id){
           if (typeof elem == 'undefined' || elem == 0 || elem == '' || elem.trim() == '') (document.querySelector('#'+id+' > div.webix_control')).classList.add("webix_invalid");
        }
               

        ctrl.validateAll = function(){
        
               (document.querySelector('#assignor > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#duedate > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#ecd > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#criticality > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#owner > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#altowner > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#actionitemtitle > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#actionitemstatement > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#closurecriteria > div.webix_control')).classList.remove("webix_invalid");
               
               if (ctrl.actionitem.assignor == 0) (document.querySelector('#assignor > div.webix_control')).classList.add("webix_invalid");
               if (ctrl.actionitem.duedate == '') (document.querySelector('#duedate > div.webix_control')).classList.add("webix_invalid");
               if (ctrl.actionitem.ecd == '' )   (document.querySelector('#ecd > div.webix_control')).classList.add("webix_invalid");
               if (typeof ctrl.actionitem.critlevel === 'undefined') (document.querySelector('#criticality > div.webix_control')).classList.add("webix_invalid");
               if (ctrl.actionitem.owner == 0 ) (document.querySelector('#owner > div.webix_control')).classList.add("webix_invalid");
               if (ctrl.actionitem.altowner == 0 ) (document.querySelector('#altowner > div.webix_control')).classList.add("webix_invalid");
               if (ctrl.actionitem.actionitemtitle.trim() == '' )  (document.querySelector('#actionitemtitle > div.webix_control')).classList.add("webix_invalid");
               if (ctrl.actionitem.actionitemstatement.trim() == '')  (document.querySelector('#actionitemstatement > div.webix_control')).classList.add("webix_invalid");
               if (ctrl.actionitem.closurecriteria.trim() == '') (document.querySelector('#closurecriteria > div.webix_control')).classList.add("webix_invalid");
        
        }
        
        ctrl.valid = function(){
            return(ctrl.actionitem.assignor != 0 &&
                   ctrl.actionitem.duedate != '' &&
                   ctrl.actionitem.ecd != '' &&
                   ctrl.actionitem.critlevel != 0 &&
                   ctrl.actionitem.owner != 0 &&
                   ctrl.actionitem.altowner != 0 &&
                   ctrl.actionitem.actionitemtitle.trim() != '' &&
                   ctrl.actionitem.actionitemstatement.trim() != '' &&
                   ctrl.actionitem.closurecriteria.trim() != '');
        };
        
        ctrl.getDateValueAndValidate = function(obj, model, field){
            CommonService.getDateValue(obj, model, 'actionitem', field);       
            ctrl.clearValidation(field);
        }               
                                
        ctrl.getItemValueAndValidate = function(obj, model, field){
            CommonService.getItemValue(obj, model, 'actionitem', field);         
            ctrl.clearValidation(field);   
        }
        
        ctrl.getItemId = function(obj, model, field){
            CommonService.getItemId(obj, model, 'actionitem', field);       
        }
        
        ctrl.getTextValueAndValidate = function(obj, model, field){
            CommonService.getTextValue(obj, model, 'actionitem', field); 
            ctrl.clearValidation(field);  
        }

        ctrl.split = function(str, delimit) {
            var array = str.split(str, delimit);
            return array;
        }

        ctrl.submit = function(){
        
            ctrl.validateAll();
            if (!ctrl.valid())
                 ctrl.msg = "Please complete form and resubmit";
            else 
                //ctrl.actionitem.duedate = ctrl.split(ctrl.actionitem.duedate,'T')[0];
                //ctrl.actionitem.ecd = ctrl.split(ctrl.actionitem.ecd, 'T')[0];
  
                $http.post('/api/actionitems', ctrl.actionitem).then(function (response){
                    if (response.data.Succeeded){
                        $scope.msg = response.data.Result;
                    }
                    else{
                        $scope.msg = $sce.trustAsHtml(response.data);
                    }
                }); 
        }
        
     

        ctrl.date = function(){
            return CommonService.formatDate(new Date());
        }
        

        $scope.$on("$destroy", function(){
             angular.element(document.querySelector('link[href="/app/tool/action/CreateActionItem.css"]')).remove();
        });
             
        
                       
        ctrl.today = new Date()

        ctrl.duedate = new Date();
        ctrl.ecd = new Date();
        ctrl.isOpen = false;
        
  }]);
