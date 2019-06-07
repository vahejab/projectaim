angular.module('Risk').directive('getRiskConfig', getRiskConfig); 

function getRiskConfig(){
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