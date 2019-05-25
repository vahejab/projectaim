angular.module('Risk').controller('RiskMatrixConfigController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService){

    $scope.risklevels = {
        riskmaximum: '',
        riskhigh: '',
        riskmedium: '',
        riskminimum: ''
    };
    $scope.risk = [];
    
    for(var l = 1; l <= 5; l++)
    {
        $scope.risk[l] = [];
        for (var c = 1; c <= 5; c++)
        {
            $scope.risk[l][c] = '';  
        }
    }
    
    
    $scope.update = function(){
        for (var likelihood = 1; likelihood <= 5; likelihood++)
            for (var consequence = 1; consequence <= 5; consequence++)
                $scope.risk[likelihood][consequence] = (((0.9*likelihood*consequence)/25) + 0.05).toFixed(2);  
    }

     $scope.save = function(){
     
       $scope.vals = {
          Levels:  
          {
            riskmaximum: $scope.risklevels.riskmaximum,
            riskhigh:    $scope.risklevels.riskhigh,
            riskmedium:  $scope.risklevels.riskmedium,
            riskminimum: $scope.risklevels.riskminimum,
          },
          Thresholds: $scope.risk
       };
          
       return $http.put('/api/riskconfig', $scope.vals).then(function(response){
           if (response.data.Succeeded){
                $scope.msg = response.data.Result;
                return response.data.Result;
           }
           else{
                $scope.msg = $sce.trustAsHtml(response.data);
           }
      });
    }
    

    $scope.getConfig = function(){
       return $http.get('/api/riskconfig').then(function(response){
           if (response.data.Succeeded){
                level = response.data.Result.Levels[0];
                $scope.risklevels.riskmaximum = level.riskmaximum;
                $scope.risklevels.riskhigh = level.riskhigh;
                $scope.risklevels.riskmedium = level.riskmedium;
                $scope.risklevels.riskminimum = level.riskminimum; 

                for (var idx = 0; idx < response.data.Result.Thresholds.length; idx++)
                {
                    var l = response.data.Result.Thresholds[idx].likelihood;
                    var c = response.data.Result.Thresholds[idx].consequence;
                    v = response.data.Result.Thresholds[idx].level;
                    $scope.risk[l][c] = v;
                }
             
                return response.data.Result;
                
           }
           else{
                $scope.msg = $sce.trustAsHtml(response.data);
           }
      });
    }
    
    $scope.getLevel = function(level, l, c){
       if (level >= $scope.risklevels.riskhigh)
           return  {level: 'H ' + l + '-' + c, cls: 'high', threshold: level};
       else if (level < $scope.risklevels.riskhigh  && level >= $scope.risklevels.riskmedium)
            return {level: 'M ' + l + '-' + c, cls: 'med', threshold: level};
       else if (level < $scope.risklevels.riskmedium)
            return {level:'L ' + l + '-' + c, cls: 'low', threshold: level};
    }     
    
    $scope.init = function(){
      angular.element(document.querySelector('link[href="/app/tool/risk/RiskMatrixConfig.css"]')).remove();
      angular.element(document.querySelector('head')).append('<link type="text/css" rel="stylesheet" href="/app/tool/risk/RiskMatrixConfig.css"/>');
      return $scope.getConfig();
    }
    
    $scope.load = function(){
        $scope.getConfig().then(function(){
            $scope.update();
        });
    }
    
    $scope.$on("$destroy", function(){
        angular.element(document.querySelector('link[href="/app/tool/risk/RiskMatrixConfig.css"]')).remove();   
    });
}]);
