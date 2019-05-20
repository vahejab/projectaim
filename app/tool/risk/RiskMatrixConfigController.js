angular.module('Risk').controller('RiskMatrixConfigController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService){
    $scope.risk = function(l, c){
        risk = document.querySelector("input[name='risk["+l+"]["+c+"]']").value;
       
        if (risk >= $scope.risklevels.riskhigh) 
            return 'high';
        else if (risk > $scope.risklevels.riskmedium && risk < $scope.risklevels.riskhigh)
            return 'med';
        else if (risk <= $scope.risklevels.riskmedium)
            return 'low';
    }
    
    $scope.risklevels = {
        riskminimum: '',
        riskhigh: '',
        riskmedium: '',
        riskminimum: ''
    }
    
   /* function create($risk, $maxlow, $minhigh, $rows, $cols){
        $level = array();
        for ($l = 1; $l <= $rows; $l++)
        {
            for ($c = 1; $c <= $cols; $c++)
            {                   
                if ($risk[$l][$c] >= $minhigh)
                    $level[$l][$c] = 'high';
                else if ($risk[$l][$c] > $maxlow && $risk[$l][$c] < $minhigh)
                    $level[$l][$c] = 'med';
                else if ($risk[$l][$c] <= $maxlow)
                    $level[$l][$c] = 'low';
            }
        }
        return $level;      
    }      */    
    
    $scope.initialize = function(){
        for (var likelihood = 1; likelihood <= 5; likelihood++)
        {
            for (var consequence = 1; consequence <= 5; consequence++)
            {
                 document.querySelector("input[name='risk["+likelihood+"]["+consequence+"]']").value = 
                    (((0.9*likelihood*consequence)/25) + 0.05).toFixed(2);  
            }
        }
    }
    
    $scope.init = function(){
      angular.element(document.querySelector('link[href="/app/tool/risk/RiskMatrixConfig.css"]')).remove();
      angular.element(document.querySelector('head')).append('<link type="text/css" rel="stylesheet" href="/app/tool/risk/RiskMatrixConfig.css"/>');
      
      $http.get('/api/riskconfig').then(function(response){
            if (response.data.Succeeded){
                $scope.risklevels.riskmaximum = response.data.Result[0].riskmaximum;
                $scope.risklevels.riskhigh = response.data.Result[0].riskhigh;
                $scope.risklevels.riskmedium = response.data.Result[0].riskmedium;
                $scope.risklevels.riskminimum = response.data.Result[0].riskminimum;
            }
            else{
                $scope.msg = $sce.trustAsHtml(response.data);
            }
      });
       
    }

     
     $scope.$on("$destroy", function(){
        angular.element(document.querySelector('link[href="/app/tool/risk/RiskMatrixConfig.css"]')).remove();   
     });
}]);
