/*angular.module('Risk').directive('risk', function(){
     return {
        restrict: 'A', 
        link: function(scope, element, attrs){
        },
        controller: function($scope){
             
            $scope.riskLevel = function(l, c){
                elem = document.querySelector("input[name='risk["+l+"]["+c+"]']");
                risk = elem.value;
                
                if (risk == '')
                    return (elem && elem.hasAttribute('class'))?
                            elem.getAttribute('class') : ''; 
                
                if (risk >= $scope.risklevels.riskhigh) 
                    return 'high';
                else if (risk >= $scope.risklevels.riskmedium && risk < $scope.risklevels.riskhigh)
                    return 'med';
                else if (risk < $scope.risklevels.riskmedium)
                    return 'low';
            }
        }
     }       
});*/

angular.module('Risk').directive('getRisk', getRisk); 

function getRisk(){
     return {
            restrict: 'A',
            controller: function ($rootScope, $scope, $http, $sce){
                
                $scope.risklevels = {
                    riskmaximum: '',
                    riskhigh: '',
                    riskmedium: '',
                    riskminimum: ''
                }
                
                $scope.riskMatrix = [];
                for(var l = 1; l <= 5; l++)
                {
                    $scope.riskMatrix[l] = [];
                    for (var c = 0; c <= 5; c++)
                    {
                        $scope.riskMatrix[l][c] = '';  
                    }
                }
                
                $rootScope.initDone = false;
                         
                $scope.init = function(){
                      angular.element(document.querySelector('link[href="/app/tool/risk/CreateRisk.css"]')).remove();
                      angular.element(document.querySelector('head')).append('<link type="text/css" rel="stylesheet" href="/app/tool/risk/CreateRisk.css"/>'); 
                      
                      return $http.get('/api/riskconfig').then(function(response){
                           if (response.data.Succeeded){
                                $scope.risklevels.riskmaximum = response.data.Result.Levels[0].riskmaximum;
                                $scope.risklevels.riskhigh = response.data.Result.Levels[0].riskhigh;
                                $scope.risklevels.riskmedium = response.data.Result.Levels[0].riskmedium;
                                $scope.risklevels.riskminimum = response.data.Result.Levels[0].riskminimum; 
                            
                             
                                for (var idx = 0; idx < response.data.Result.Thresholds.length; idx++)
                                {
                                    var l = response.data.Result.Thresholds[idx].likelihood;
                                    var c = response.data.Result.Thresholds[idx].consequence;
                                    v = response.data.Result.Thresholds[idx].level;
                                    $scope.riskMatrix[l][c] = v;
                                }
                             
                                return response.data.Result;
                           }
                           else{
                                $scope.msg = $sce.trustAsHtml(response.data);
                           }
                      });
                } 
                
                $scope.init().then(function(){
                    $rootScope.initDone = true;
                    return $rootScope.initDone;
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