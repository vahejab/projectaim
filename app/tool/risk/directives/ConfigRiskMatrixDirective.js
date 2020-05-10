angular.module('Risk').directive('configRiskMatrix', ['$sce', configMatrix]);

function configMatrix($sce){
     return {
        restrict: 'E', 
        link: function(scope, element, attrs){
        },
        controller: function($scope, $http){ 
             return $http.get('/api/riskconfig').then(function(response){
                   if (response.data.Succeeded){
                        $scope.ctrl.risklevels.riskmaximum = response.data.Result.Levels[0].riskmaximum;
                        $scope.ctrl.risklevels.riskhigh = response.data.Result.Levels[0].riskhigh;
                        $scope.ctrl.risklevels.riskmedium = response.data.Result.Levels[0].riskmedium;
                        $scope.ctrl.risklevels.riskminimum = response.data.Result.Levels[0].riskminimum; 
                    
                     
                        for (var idx = 0; idx < response.data.Result.Thresholds.length; idx++)
                        {
                            var l = response.data.Result.Thresholds[idx].likelihood;
                            var c = response.data.Result.Thresholds[idx].consequence;
                            v = response.data.Result.Thresholds[idx].level;
                            $scope.ctrl.riskMatrix[l][c] = v;
                        }
                     
                        $scope.ctrl.riskConfigFetched = true;
                        return response.data.Result;
                        
                   }
                   else{
                        $scope.ctrl.msg = $sce.trustAsHtml(response.data);
                   }
                   
             });
        }                                         
     }
}   