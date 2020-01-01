//angular.module(Risk).directive(initRiskTable, initRiskTable);

function initRiskTable(){
    return {
        restrict: 'A',
        //transclude: true,
        templateUrl: '/app/tool/risk/RiskTable.html',
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
                        var headers = angular.element(document.querySelector(div.tableheader table.grid thead tr)).children();
                        var cells = angular.element(document.querySelector(div.tablebody table.grid tbody tr:nth-child(1))).children();
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
                    
                    //angular.element(document.querySelector(html)).attr("style", "margin-right: " + 0*$scope.scrollBarWidth() + "px !important");
                    angular.element(document.querySelector(div.tableheader)).attr("style", "margin-right: " + $scope.scrollBarWidth() + "px !important");
                    angular.element(document.querySelector(div.tablebody)).attr("style", "margin-right " + $scope.scrollBarWidth() + "px !important");    
                }
            }
        },
        link: function (scope, element, attrs) {
            scope.init().then(function(){
                
            });
        }
    }
}