angular.module('Action').directive('initAction', function(){                     
      return {
            restrict: 'E',
            link: function (scope, element, attrs) {
                  scope.init().then(function(){
                    
                    webix.ready(function(){
                        webix.ui.fullScreen();
                    });
                    
                    function GetDate(date)
                    {
                        if (date != '' && date != null)
                            return new Date(date);    
                        return null;
                    }
                    
                    function getSelectConfig(attr, options)
                    {
                        var config = 
                        {
                            view: "richselect",
                            value: scope.actionitem[attr], 
                            options: options,
                            on: {
                                //"onChange": function(){var obj = this.eventSource || this; getValue(obj, 'assignor')},
                                "onChange": function(){var obj = this.eventSource || this; scope.getItemValueAndValidate(obj, scope, attr)}
                                //"onBlur": function(){scope.validate(scope.actionitem.assingor, 'assignor')}
                            },
                            responsive: true,
                            width: "200",
                            height: "30",
                            validate: webix.rules.isSelected,
                            required: true
                        };
                        return config;
                    }
                    
                    function getSelectTextAndValConfig(attr, attrid, options)
                    {
                        var config = 
                        {
                            view: "richselect",
                            value: scope.actionitem[attrid], 
                            options: options,
                            on: {
                                //"onChange": function(){var obj = this.eventSource || this; getValue(obj, 'assignor')},
                                "onChange": function(){ var obj = this.eventSource || this; scope.getItemValueAndValidate(obj, scope, attr);  scope.getItemId(obj, scope, attrid)}
                                //"onBlur": function(){scope.validate(scope.actionitem.assingor, 'assignor')}
                            },
                            responsive: true,
                            width: "200",
                            height: "30",
                            validate: webix.rules.isSelected,
                            required: true
                        };
                        return config;
                    }
                    
                    function getTextConfig(attr)
                    {
                        var config = 
                        {
                            view:"text",
                            value: scope.actionitem[attr],      
                            on: {
                                "onChange": function(){var obj = this.eventSource || this; scope.getTextValueAndValidate(obj, scope, attr)},
                                //"onBlur": function(){scope.validate(scope.actionitem.title, 'title')}
                            },
                           
                            responsive: true,
                            width: "520",
                            height: "30",
                            validate: webix.rules.isNotEmpty,
                            required: true
                        };
                        return config;
                    }
                    
                    function getTextareaConfig(attr)
                    {
                        var config = 
                        {
                            view:"textarea",
                            value: scope.actionitem[attr],
                            on: {                                  
                                "onChange": function(){var obj = this.eventSource || this; scope.getTextValueAndValidate(obj, scope, attr)},
                                //"onBlur": function(){scope.validate(scope.actionitem.actionitemstatement, 'actionitemstatement')}
                            },
                            responsive: true,
                            width: "520",
                            height: "97",
                            validate: webix.rules.isSelected,
                            required: true
                        };
                        return config;
                    }
                    
                    function getDatepickerConfig(attr)
                    {
                        var config = 
                        {
                            view: "datepicker", 
                            value: GetDate(scope.actionitem[attr]),
                            timepicker: false,
                            //multiselect: true,
                            suggest:{
                                type:"calendar", 
                                body:{
                                    minDate:(new Date()).setDate(new Date())
                                }                                         
                            },      
                            on: {
                                "onChange": function(){var obj = this.eventSource || this; scope.getDateValueAndValidate(obj, scope, attr)},
                                //"onBlur": function(){scope.validate(scope.actionitem.duedate, 'duedate')}  
                            },   
                            responsive: true,
                            width: "200",                       
                            height: "30",
                            validate: webix.rules.isSelected,
                            required: true
                        };
                        return config;
                    }
                    
                    scope.assignorConfig = getSelectConfig('assignor', scope.users);
                    
                    scope.approverConfig = getSelectConfig('approver', scope.users);
                    
                    scope.ownerConfig = getSelectConfig('owner', scope.users);
                    
                    scope.altownerConfig = getSelectConfig('altowner', scope.users);
                    
                    scope.critConfig = getSelectTextAndValConfig('criticality', 'critlevel', scope.critlevels);
                    
                    scope.titleConfig = getTextConfig('actionitemtitle');
                    
                    scope.closurecriteriaConfig = getTextareaConfig('closurecriteria');
                    
                    scope.statementConfig = getTextareaConfig('actionitemstatement');
                   
                    scope.duedateConfig = getDatepickerConfig('duedate');     
                    
                    scope.assigneddateConfig = getDatepickerConfig('assigneddate');
                     
                    scope.ecdConfig = getDatepickerConfig('ecd');
                    
                    scope.completiondateConfig = getDatepickerConfig('completiondate');
                   
                    scope.closeddateConfig = getDatepickerConfig('closeddate');
                    
                    scope.approvercommentsConfig = getTextareaConfig('approvercomments');
                    
                    scope.ownernotesConfig = getTextareaConfig('ownernotes');    
            });
      }
}            
}).directive('initActionTable', function(){
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
                var msie = document.documentMode;
                if(refresh){ 
                    $timeout(refreshEvery,1);
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

                    if (refresh && !msie)
                        $scope.refreshingPromise = $timeout(refreshEvery,1);
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
