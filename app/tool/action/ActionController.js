angular.module('Action').controller('ActionController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', 'CommonService', /*'DTOptionsBuilder',*/ function($http, $resource, $scope, $state, $window, $timeout, $interval, CommonService/*, DTOptionsBuilder*/){
        refresh = true;
        $scope.CommonService = CommonService;
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
        
        
      
        $scope.devicePixelRatio = window.devicePixelRatio;
        $scope.flag = 0;
 
        
        $scope.$on("$destroy", function(){
             $timeout.cancel($scope.refreshingPromise);
             $scope.isRefreshing = false;  //stop refreshing
             $scope.refresh = false;
        });

        
        $scope.formatCriticality = function(value){ 
            return CommonService.formatCriticality(value);
        }
        
        $scope.getStatus = function(date1, date2){
           return CommonService.getStatus(date1, date2); 
        }
         
        $scope.init = function(){
            return $http.get('api/actionitems').then(function(response){
               if (response.data.Succeeded){
                    angular.forEach(response.data.Result, function(key, actionitem){
                        response.data.Result[key] =  
                        { 
                            actionitemid: actionitem.actionitemid, 
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
}]).directive('initTable', function(){
    return {
        restrict: 'A',
        //transclude: true,
        templateUrl: '/app/tool/action/ActionItemTable.html',
        controller: function($scope, $timeout) {
            $scope.scrollBarWidth = function(){
                    var outer = document.createElement("div");
                    outer.style.visibility = "hidden";
                    outer.style.width = "100px";
                    outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

                    document.body.appendChild(outer);

                    var widthNoScroll = outer.offsetWidth;
                    // force scrollbars
                    outer.style.overflow = "scroll";

                    // add innerdiv
                    var inner = document.createElement("div");
                    inner.style.width = "100%";  
                    outer.appendChild(inner);        

                    var widthWithScroll = inner.offsetWidth;

                    // remove divs
                    outer.parentNode.removeChild(outer);

                    return widthNoScroll - widthWithScroll;
            }
            $scope.setMarginsWidths = function(){
                $scope.flag = 0;
                refresh = 1;
                if(refresh){ 
                    $timeout(refreshEvery,0);
                }

                function refreshEvery(){
                    if ($scope.flag == 0 || window.devicePixelRatio != $scope.devicePixelRatio)
                    {   
                        $scope.flag = 1;
                        $scope.devicePixelRatio = window.devicePixelRatio;
                        var headers = angular.element(document.querySelector('div.tableheader table.grid thead tr')).children();
                        var cells = angular.element(document.querySelector('div.tablebody table.grid tbody tr:nth-child(1)')).children();
                        angular.forEach(cells, function(cell, idx){
                            var cellwidth = cell.getBoundingClientRect().width;
                            headers[idx].width = cellwidth;
                        });
                    }
                    
                    if (refresh)
                        $scope.refreshingPromise = $timeout(refreshEvery,0);
                    else{
                         $scope.isRefreshing = false;
                         $timeout.cancel($scope.refreshingPromise);
                    }
                    
                    //angular.element(document.querySelector('html')).attr("style", "margin-right: " + 0*$scope.scrollBarWidth() + "px !important");
                    angular.element(document.querySelector('div.tableheader')).attr("style", "margin-right: " + $scope.scrollBarWidth() + "px !important");
                    angular.element(document.querySelector('div.tablebody')).attr("style", "margin-right " + $scope.scrollBarWidth() + "px !important");    
                }
            }
        },
        link: function (scope, element, attrs) {
            scope.init().then(function(){
                
            });
        }
    }
}).directive('ngRepeatDone', function(){
    return {
        restrict: 'A',
        controller: function($scope, $timeout){
            $scope.devicePixelRatio = window.devicePixelRatio;
            $scope.setMarginsWidths();
            var tablebody = document.querySelector('div.tablebody');
            var tableheader = document.querySelector('div.tableheader');
            angular.element(tablebody).on("scroll", function(elem, attrs){  //activate when #center scrolls  
                left = $scope.CommonService.offset(angular.element(document.querySelector("div.tablebody table.grid"))[0]).left; //save #center position to var left
                (angular.element(tableheader)[0]).scrollLeft = -1*left + $scope.scrollBarWidth();
            }); 
        }
    }
});