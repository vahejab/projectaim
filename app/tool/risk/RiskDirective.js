/*angular.module('Risk').directive('risk', function(){
     return {
        restrict: 'A', 
        link: function(scope, element, attrs){
        },
        controller: function($scope){
             
            vm.riskLevel = function(l, c){
                elem = document.querySelector("input[name='risk["+l+"]["+c+"]']");
                risk = elem.value;
                
                if (risk == '')
                    return (elem && elem.hasAttribute('class'))?
                            elem.getAttribute('class') : ''; 
                
                if (risk >= vm.risklevels.riskhigh) 
                    return 'high';
                else if (risk >= vm.risklevels.riskmedium && risk < vm.risklevels.riskhigh)
                    return 'med';
                else if (risk < vm.risklevels.riskmedium)
                    return 'low';
            }
        }
     }       
});*/

angular.module('Risk').directive('getRisk', getRisk); 

function getRisk(){
     return {
            restrict: 'E',
            controller: function ($scope, $element, $attrs, $http, $sce){
            
                angular.element(document.querySelector('link[href="/app/tool/risk/CreateRisk.css"]')).remove();
                angular.element(document.querySelector('head')).append('<link type="text/css" rel="stylesheet" href="/app/tool/risk/CreateRisk.css"/>'); 
          
                return $http.get('/api/riskconfig').then(function(response){
                    if (response.data.Succeeded){
                        $scope.ctrl.initRisk(response.data.Result);
                        $scope.ctrl.setup.done = true;
                        return response.data.Result;
                    }
                    else{
                        $scope.msg = $sce.trustAsHtml(response.data);
                    }
                });
          }
     } 
  
}
/*.directive('initRiskTable', function(){
    return {
        restrict: 'A',
        //transclude: true,
        templateUrl: '/app/tool/risk/RiskTable.html',
        controller: function($scope, $timeout) {
            vm.scrollBarWidth = function(){
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
            vm.setMarginsWidths = function(){
                vm.flag = 0;
                refresh = 1;
                var msie = document.documentMode;
                if(refresh){ 
                    $timeout(refreshEvery,1);
                }
                
                function refreshEvery(){
                    if (vm.flag == 0 || window.devicePixelRatio != vm.devicePixelRatio)
                    {   
                        vm.flag = 1;
                        vm.devicePixelRatio = window.devicePixelRatio;
                        var headers = angular.element(document.querySelector('div.tableheader table.grid thead tr')).children();
                        var cells = angular.element(document.querySelector('div.tablebody table.grid tbody tr:nth-child(1)')).children();
                        angular.forEach(cells, function(cell, idx){
                            var cellwidth = cell.getBoundingClientRect().width;
                            headers[idx].width = cellwidth;
                        });
                    }

                    if (refresh && !msie)
                        vm.refreshingPromise = $timeout(refreshEvery,1);
                    else{
                         vm.isRefreshing = false;
                         $timeout.cancel(vm.refreshingPromise);
                    }
                    
                    //angular.element(document.querySelector('html')).attr("style", "margin-right: " + 0*vm.scrollBarWidth() + "px !important");
                    angular.element(document.querySelector('div.tableheader')).attr("style", "margin-right: " + vm.scrollBarWidth() + "px !important");
                    angular.element(document.querySelector('div.tablebody')).attr("style", "margin-right " + vm.scrollBarWidth() + "px !important");    
                }
            }
        },
        link: function (scope, element, attrs) {
            scope.init().then(function(){
                
            });
        }
    }
}).directive('load', function(){
        function link(scope, elem, attrs){
            scope.init().then(function(){
                    for (var likelihood = 1; likelihood <= 5; likelihood++)
                        for (var consequence = 1; consequence <= 5; consequence++)
                            scope.risk[likelihood][consequence] = (((0.9*likelihood*consequence)/25) + 0.05).toFixed(2);  
            }); 
        }
        var directive = {
            restrict: 'A',
            link: link
        };
        
        return directive;
});*/