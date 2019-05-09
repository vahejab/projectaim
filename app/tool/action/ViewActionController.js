angular.module('Action').controller('ViewActionController', ['$http', '$resource', '$stateParams', '$scope', '$state', '$timeout', 'CommonService', /*'DTOptionsBuilder',*/ function($http, $resource, $stateParams, $scope, $state, $timeout, CommonService/*, DTOptionsBuilder*/){
        refresh = false;
        
        $scope.actionitem = {
                actionitemid: 0,
                actionitemtitle: '',
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

        $scope.setMargin = function(elem, times){
            CommonService.setMargin(elem, times);
        }
        
        $scope.formatCriticality = function(value){ 
            return CommonService.formatCriticality(value);
        }
        
        $scope.getStatus = function(date1, date2){
           return CommonService.getStatus(date1, date2); 
        }
        
                     
        $scope.$on("$destroy", function(){
             angular.element(document.querySelector('link[href="/app/tool/action/ViewActionItem.css"]')).remove();
        });
        
        $scope.critlevels = [
          {id: 0, value: ''},
          {id: 1, value: 'High'},
          {id: 2, value: 'Med'},
          {id: 3, value: 'Low'},
          {id: 4, value: 'None'} 
        ];
         
        $scope.init = function(){
            //var vm = this;
            //vm.dtOptions = DTOptionsBuilder
            //.fromFnPromise(function(){
            return $http.get('api/actionitems/'+$stateParams.id).then(function(response){
                    
                    $scope.actionitem.actionitemid = response.data.Results.actionitemid; 
                    $scope.actionitem.actionitemtitle = response.data.Results.actionitemtitle;
                    $scope.actionitem.criticality = $scope.critlevels[response.data.Results.criticality || 0].value;
                    $scope.actionitem.critlevel = response.data.Results.criticality;
                    $scope.actionitem.assignor = response.data.Results.assignor;
                    $scope.actionitem.owner = response.data.Results.owner;
                    $scope.actionitem.altowner = response.data.Results.altowner;
                    $scope.actionitem.approver = response.data.Results.approver;
                    $scope.actionitem.assigneddate = response.data.Results.assigneddate;
                    $scope.actionitem.duedate = response.data.Results.duedate;
                    $scope.actionitem.ecd = response.data.Results.ecd;
                    $scope.actionitem.completiondate = response.data.Results.completiondate;
                    $scope.actionitem.closeddate = response.data.Results.closeddate;
                    $scope.actionitem.actionitemstatement = response.data.Results.actionitemstatement;
                    $scope.actionitem.closurecriteria = response.data.Results.closurecriteria;
                    $scope.actionitem.ownernotes = response.data.Results.ownernotes;
                    $scope.actionitem.approvercomments = response.data.Results.approvercommens;
                    $scope.actionitem.activitylog = response.data.Results.activitylog; 
                    return response.data.Results;
            });                                   
       }              
}]);