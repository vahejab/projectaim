angular.module('Action').controller('ActionController', ['$http', '$resource', '$scope', '$state', '$timeout', 'CommonService', /*'DTOptionsBuilder',*/ function($http, $resource, $scope, $state, $timeout, CommonService/*, DTOptionsBuilder*/){
        $scope.actionitems = [];                          
        $scope.actionitem = {
                actionitemid: 0,
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
        
        
        $scope.setMargin = function(elem, times){
            CommonService.setMargin(elem, times);
        }

        $scope.assignHeaderWidths = function(){
            CommonService.assignHeaderWidths();
        }
        
        $scope.formatCriticality = function(value){ 
            return CommonService.formatCriticality(value);
        }
        
        $scope.getStatus = function(date1, date2){
           return CommonService.getStatus(date1, date2); 
        }
         
        $scope.init = function(){
            //var vm = this;
            //vm.dtOptions = DTOptionsBuilder
            //.fromFnPromise(function(){
            
            CommonService.initTableScrolling();

            return $http.get('api/actionitems').then(function(response){
               if (response.data.Succeeded){
                    $.each(response.data.Result, function(key, actionitem){
                        response.data.Result[key] =  
                        { 
                            actionitemid: parseInt(actionitem.actionitemid), 
                            title: actionitem.actionitemtitle,
                            criticality: actionitem.criticality,
                            critlevel: actionitem.critlevel,
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
                return [];
               }
            });                                   
       }              
            
            //.withPaginationType('full_numbers')
            //.withDisplayLength(10)
            //.withOption('order', [1, 'desc'])
            //.withOption('scrollY', 500)
            //.withOption('scrollX', '100%')
            //.withDOM('lftrpi')
            //.withScroller();
}]).directive('initTable', function(){
    return {
        restrict: 'A',
        //transclude: true,
        templateUrl: '/app/tool/action/ActionItemTable.html',
        controller: function($scope, $timeout) {
            //console.log($scope, $timeout);
            $timeout( function() {
                $scope.setMargin($('html'), 0);
                $scope.setMargin($('div.tableheader'), 2);
                $scope.setMargin($('div.tablebody'), 1);
            });
        },
        link: function (scope, element, attrs) {
            scope.init().then(function(){
                $.bootstrapSortable(true); 
            });
        }
    }
}).directive('ngRepeatDone', function(){
    return {
        restrict: 'A',
        controller: function($scope, $timeout){
             if ($scope.$last){
                 $timeout(function(){
                    $scope.assignHeaderWidths();
                 });
             }
        }
    }
});