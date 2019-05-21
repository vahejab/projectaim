angular.module('Risk').controller('RiskMatrixConfigController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService){

    $scope.risklevels = {
        riskminimum: '',
        riskhigh: '',
        riskmedium: '',
        riskminimum: ''
    };

    /*$scope.risk = {
        1: {1: '', 2: '', 3: '', 4: '', 5: ''},
        2: {1: '', 2: '', 3: '', 4: '', 5: ''},
        3: {1: '', 2: '', 3: '', 4: '', 5: ''},
        4: {1: '', 2: '', 3: '', 4: '', 5: ''},
        5: {1: '', 2: '', 3: '', 4: '', 5: ''},
    };*/
    
    $scope.risk = [];
    for(var l = 1; l <= 5; l++)
    {
        $scope.risk[l] = [];
        for (var c = 0; c <= 5; c++)
        {
            $scope.risk[l][c] = '';  
        }
    }                    
    
    $scope.getConfig = function(){
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
                    $scope.risk[l][c] = v;
                }
             
                return response.data.Result;
                
           }
           else{
                $scope.msg = $sce.trustAsHtml(response.data);
           }
      });
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
    

    $scope.init = function(){
      angular.element(document.querySelector('link[href="/app/tool/risk/RiskMatrixConfig.css"]')).remove();
      angular.element(document.querySelector('head')).append('<link type="text/css" rel="stylesheet" href="/app/tool/risk/RiskMatrixConfig.css"/>');
   
      return $scope.getConfig();
    }
    
    $scope.reload = function(){
        $scope.getConfig().then(function(){
         $scope.update();
        });
    }

     
     $scope.$on("$destroy", function(){
        angular.element(document.querySelector('link[href="/app/tool/risk/RiskMatrixConfig.css"]')).remove();   
     });
}]);
