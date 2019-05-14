angular.module('Action').controller('EditActionController', ['$http', '$resource', '$stateParams', '$scope', '$state', '$timeout', '$sce', 'CommonService', /*'DTOptionsBuilder',*/ function($http, $resource, $stateParams, $scope, $state, $timeout, $sce, CommonService/*, DTOptionsBuilder*/){
        refresh = false;
        
        $scope.actionitem = {
                actionitemid: 0,
                actionitemtitle: '',
                status: (this.completiondate) ? 'Open' : 'Completed',
                criticality: '',
                critlevel: 0,
                assignor: 0,
                owner: 0,
                altowner: 0,
                approver: 0,
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
        
        $scope.users = [];

        $scope.critlevels = 
        [
          {id: 1, value: 'High'},
          {id: 2, value: 'Med'},
          {id: 3, value: 'Low'},
          {id: 4, value: 'None'} 
        ];
                     
        $scope.$on("$destroy", function(){
             angular.element(document.querySelector('link[href="/app/tool/action/EditActionItem.css"]')).remove();
        });

        
        $scope.initUsers = function(){
            return $http.get('api/users').then(function(response){
                if (response.data.Succeeded){
                
                   for (var key = 0; key < response.data.Result.length; key++){
                        user = response.data.Result[key];     
                        $scope.users.push({id: user.id, value: user.name});
                   }
            
                   return response.data.Result;
                }
                else{
                     $scope.msg += "<br />"+ $sce.trustAsHtml(response.data);
                }
            }); 
        }
          
         
        $scope.init = function(){
            //var vm = this;
            //vm.dtOptions = DTOptionsBuilder
            //.fromFnPromise(function(){
            return $http.get('api/actionitems/'+$stateParams.id).then(function(response){
                  if (response.data.Succeeded){  
                    $scope.actionitem.actionitemid = response.data.Results.actionitemid; 
                    $scope.actionitem.actionitemtitle = response.data.Results.actionitemtitle;
                    $scope.actionitem.criticality = $scope.critlevels[response.data.Results.criticality].value;
                    $scope.actionitem.critlevel = response.data.Results.criticality;
                    $scope.actionitem.assignor = response.data.Results.assignorId;
                    $scope.actionitem.owner = response.data.Results.ownerId;
                    $scope.actionitem.altowner = response.data.Results.altownerId;
                    $scope.actionitem.approver = response.data.Results.approverId;
                    $scope.actionitem.assigneddate = response.data.Results.assigneddate;
                    $scope.actionitem.duedate = response.data.Results.duedate;
                    $scope.actionitem.ecd = response.data.Results.ecd;
                    $scope.actionitem.completiondate = response.data.Results.completiondate;
                    $scope.actionitem.closeddate = response.data.Results.closeddate;
                    $scope.actionitem.actionitemstatement = response.data.Results.actionitemstatement;
                    $scope.actionitem.closurecriteria = response.data.Results.closurecriteria;
                    $scope.actionitem.ownernotes = response.data.Results.ownernotes;
                    $scope.actionitem.approvercomments = response.data.Results.approvercomments;
                    $scope.actionitem.activitylog = response.data.Results.activitylog; 
                    return response.data.Results;
                  }
                  else{
                     $scope.msg += "<br />"+$sce.trustAsHtml(response.data);
                  }
            }).then(function(){
                return $scope.initUsers();
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
               (document.querySelector('#closeddate > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#completiondate > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#criticality > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#owner > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#altowner > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#actionitemtitle > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#approver > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#actionitemstatement > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#closurecriteria > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#ownernotes > div.webix_control')).classList.remove("webix_invalid");
               (document.querySelector('#approvercomments > div.webix_control')).classList.remove("webix_invalid");
              
               if ($scope.actionitem.assignor == 0) (document.querySelector('#assignor > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.duedate == '') (document.querySelector('#duedate > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.ecd== '' ) (document.querySelector('#ecd > div.webix_control')).classList.add("webix_invalid"); 
               if ($scope.actionitem.closeddate == '' ) (document.querySelector('#closeddate > div.webix_control')).classList.add("webix_invalid"); 
               if ($scope.actionitem.completiondate == '' ) (document.querySelector('#completiondate > div.webix_control')).classList.add("webix_invalid"); 
               if ($scope.actionitem.criticality == '') (document.querySelector('#criticality > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.owner == 0 ) (document.querySelector('#owner > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.altowner == 0 ) (document.querySelector('#altowner > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.approver == 0 ) (document.querySelector('#approver > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.actionitemtitle.trim() == '' )  (document.querySelector('#actionitemtitle > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.actionitemstatement.trim() == '')  (document.querySelector('#actionitemstatement > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.closurecriteria.trim() == '') (document.querySelector('#closurecriteria > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.ownernotes.trim() == '') (document.querySelector('#ownernotes > div.webix_control')).classList.add("webix_invalid");
               if ($scope.actionitem.approvercomments.trim() == '') (document.querySelector('#approvercomments > div.webix_control')).classList.add("webix_invalid");
        }
        
        $scope.valid = function(){
            return($scope.actionitem.assignor != 0 &&
                   $scope.actionitem.duedate != '' &&
                   $scope.actionitem.ecd != '' &&
                   $scope.actionitem.closeddate != '' &&
                   $scope.actionitem.completiondate != '' &&
                   $scope.actionitem.criticality != '' &&
                   $scope.actionitem.owner != 0 &&
                   $scope.actionitem.altowner != 0 &&
                   $scope.actionitem.approver != 0 &&
                   $scope.actionitem.actionitemtitle.trim() != '' &&
                   $scope.actionitem.actionitemstatement.trim() != '' &&
                   $scope.actionitem.closurecriteria.trim() != '' &&
                   $scope.actionitem.ownernotes != '' &&
                   $scope.actionitem.approvercomments != '');
        };
       
       
       $scope.getDateValueAndValidate = function(obj, model, field){
            CommonService.getDateValue(obj, model, field);       
            $scope.clearValidation(field);
        }               
                                
        $scope.getItemValueAndValidate = function(obj, model, field){
            CommonService.getItemValue(obj, model, field);         
            $scope.clearValidation(field);   
        }
        
        $scope.getItemId= function(obj, model, field){
            CommonService.getItemId(obj, model, field);       
        }
        
        $scope.getTextValueAndValidate = function(obj, model, field){
            CommonService.getTextValue(obj, model, field); 
            $scope.clearValidation(field);  
        }

       
       $scope.submit = function(){
        
            $scope.validateAll();
            if (!$scope.valid())
                 $scope.msg = "Please complete form and resubmit";
            else 
                //$scope.actionitem.duedate = $scope.split($scope.actionitem.duedate,'T')[0];
                //$scope.actionitem.ecd = $scope.split($scope.actionitem.ecd, 'T')[0];
                $http.put('/api/actionitems', $scope.actionitem).then(function(response){
                    if (response.data.Succeeded){
                        $scope.msg = response.data.Result;
                    }
                    else{
                        $scope.msg = $sce.trustAsHtml(response.data);
                    }
                }); 
        }
               
}]).filter('unquote', function () {
    return function(value) {
        if(!angular.isString(value)) {
            return value;
        }  
        return value.replace(/^['"]+$/g, ''); // you could use .trim, but it's not going to work in IE<9
    };
});;
