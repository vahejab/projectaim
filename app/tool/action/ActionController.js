angular.module('Action').controller('ActionController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', /*'DTOptionsBuilder',*/ function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService/*, DTOptionsBuilder*/){
        refresh = true;
        $scope.CommonService = CommonService;
        $scope.actionitems = [];                          
        $scope.actionitem = {
                actionitemid: 0,
                actionitemtitle: '',
                status: (this.completiondate) ? 'Open' : 'Completed',
                criticality: '',
                critlevel: 0,
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
        function GetActionItems2()
        {
           return $resource('actionitems.json').query().$promise;
        }   
        
        $scope.propertyName = 'actionitemid';
        $scope.reverse = false;
                
        $scope.sort = function(propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };
        
        
      
        $scope.devicePixelRatio = window.devicePixelRatio;
        $scope.flag = 0;
 
        
        $scope.$on("$destroy", function(){
             angular.element(document.querySelector('link[href="/app/tool/action/ActionItems.css"]')).remove();   
             $timeout.cancel($scope.refreshingPromise);
             $scope.isRefreshing = false;  //stop refreshing
             $scope.refresh = false;
             refresh = false;
        });

        
        $scope.formatCriticality = function(value){ 
            return CommonService.formatCriticality(value);
        }
        
        $scope.getStatus = function(date1, date2){
           return CommonService.getStatus(date1, date2); 
        }
        
           
        $scope.critlevels = 
        [
          {id: 0, value: ''},
          {id: 1, value: 'High'},
          {id: 2, value: 'Med'},
          {id: 3, value: 'Low'},
          {id: 4, value: 'None'} 
        ];
        
        $scope.init = function(){
            return $http.get('api/actionitems').then(function(response){
               if (response.data.Succeeded){
                    angular.forEach(response.data.Result, function(actionitem, key){
                        response.data.Result[key] =  
                        { 
                            actionitemid: actionitem.actionitemid, 
                            actionitemtitle: actionitem.actionitemtitle,
                            critlevel: actionitem.criticality,
                            criticality: $scope.critlevels[actionitem.criticality || 0].value,
                            assignor: actionitem.assignor,
                            owner: actionitem.owner,
                            altowner: actionitem.altowner,
                            approver: actionitem.approver,
                            assigneddate: actionitem.assigneddate,
                            duedate: actionitem.duedate,
                            ecd: actionitem.ecd,
                            completiondate: actionitem.completiondate,
                            closeddate: actionitem.closeddate
                        };    
                    });
                    $scope.actionitems = response.data.Result;
                    return response.data.Result;
               }
               else{  
                $scope.msg += "<br />" + $sce.trustAsHtml(response.data);
               }
            });                                   
       }

}]);