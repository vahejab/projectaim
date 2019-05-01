angular.module('Action').controller('ActionController', ['$http', '$resource', '$scope', '$state', '$timeout', '$interval', 'CommonService', /*'DTOptionsBuilder',*/ function($http, $resource, $scope, $state, $timeout, $interval, CommonService/*, DTOptionsBuilder*/){
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
        
        
        $scope.setMargin = function(elem, factor){
            scrollBarWidth = CommonService.getScrollBarWidth();
            $(elem).attr("style", "margin-right: " + factor*scrollBarWidth + "px !important");
        }

        $scope.assignHeaderWidths = function(){
            var headers = $('div.tableheader table thead th');
            var cells = $('div.tablebody table tbody tr:nth-child(1) td');
            for (var idx in headers){
                var cellwidth = $(cells[idx]).width();
                $(headers[idx]).attr('style', 'width: ' + cellwidth + "px !important");
            } 
        }

        
        $scope.devicePixelRatio = window.devicePixelRatio;
        $scope.zoomFlag = 1;
   
       $scope.setZoomWidth = $interval(function(){              
                if ($scope.flag && window.devicePixelRatio == .25){
                    $scope.$scope($('html'), 0);
                    $scope.setMargin($('div.tableheader'), 2);
                    $scope.setMargin($('div.tablebody'), 1);
                    $scope.assignHeaderWidths();
                }  
                                        
                else if(window.devicePixelRatio != $scope.devicePixelRatio){
                    $scope.zoomFlag = 1;
                    $scope.devicePixelRatio = window.devicePixelRatio;
                    //there was a resize and so then we set margin in this case
                    $scope.setMargin($('html'), 0);
                    $scope.setMargin($('div.tableheader'), 2);
                    $scope.setMargin($('div.tablebody'), 1);
                    //Set header width to ensure they will match on any zoom
                    $scope.assignHeaderWidths();    
                }
        },0)
        
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
   
        $scope.$on('$destroy',function(){
            if($scope.setZoomWidth)
                $interval.cancel($scope.setZoomWidth);   
        });
        
          
               
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
                    //$scope.setZoomWidth();
                 });
             }
        }
    }
});