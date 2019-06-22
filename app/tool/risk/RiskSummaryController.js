angular.module('Risk').controller('RiskSummaryController', ['$http', '$resource', '$scope', '$state', '$window', '$timeout', '$interval', '$sce', 'CommonService', /*'DTOptionsBuilder',*/ function($http, $resource, $scope, $state, $window, $timeout, $interval, $sce, CommonService/*, DTOptionsBuilder*/){
        refresh = true;
        $scope.CommonService = CommonService;
        $scope.risks = [];                          
        $scope.risk = {
                riskid: 0,
                risktitletitle: '',
                riskstatement: '',
                context: '',
                closurecriteria: '',
                likelihood: '',
                technical: '',
                schedule: '',
                cost: '',
                risklevel: '',
                assignor: '',
                owner: '',
                approver: '',
                assessmentdate: ''
        }
       
        $scope.propertyName = 'riskid';
        $scope.reverse = false;
                
        $scope.sort = function(propertyName) {
            $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
            $scope.propertyName = propertyName;
        };
        
        $scope.risklevels = {
            riskmaximum: '',
            riskhigh: '',
            riskmedium: '',
            riskminimum: ''
        };
        
        $scope.riskMatrix = [];
        for(var l = 1; l <= 5; l++)
        {
            $scope.riskMatrix[l] = [];
            for (var c = 1; c <= 5; c++)
            {
                $scope.riskMatrix[l][c] = '';  
            }
        }   
      
        $scope.devicePixelRatio = window.devicePixelRatio;
        $scope.flag = 0;
 
        
        $scope.$on("$destroy", function(){
             //angular.element(document.querySelector('link[href="/app/tool/action/ActionItems.css"]')).remove();   
             $timeout.cancel($scope.refreshingPromise);
             $scope.isRefreshing = false;  //stop refreshing
             $scope.refresh = false;
             refresh = false; //stop refreshing globally
        });

        
        $scope.formatCriticality = function(value){ 
            return CommonService.formatCriticality(value);
        }
        
        $scope.getStatus = function(date1, date2){
           return CommonService.getStatus(date1, date2); 
        }
        
        $scope.getLevel = function(risk, l, c){
           if (risk >= $scope.risklevels.riskhigh)
               return  {level: 'H ' + l + '-' + c, cls: 'high', threshold: level};
           else if (risk < $scope.risklevels.riskhigh  && risk >= $scope.risklevels.riskmedium)
                return {level: 'M ' + l + '-' + c, cls: 'med', threshold: level};
           else if (risk < $scope.risklevels.riskmedium)
                return {level:'L ' + l + '-' + c, cls: 'low', threshold: level}
        }  
 
        $scope.getRisk = function(l, t, s, c){
            
            likelihood = Number(l);
            technical = Number(t);
            schedule = Number(s);
            cost = Number(c);
            consequence = Math.max(technical, schedule, cost);
            level = $scope.riskMatrix[likelihood][consequence];
            risk = $scope.getLevel(level, likelihood, consequence);
            return risk;
        }
        
        $scope.init = function(){  
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
          }).then(function(){
             return $http.get('api/risks').then(function(response){
               if (response.data.Succeeded){
                    angular.forEach(response.data.Result, function(risk, key){
                        response.data.Result[key] =  
                        { 
                            riskid: risk.riskid,
                            risktitle: risk.risktitle,
                            riskstatement: risk.riskstatement,
                            context: risk.riskcontext,
                            closurecriteria: risk.closurecriteria,
                            likelihood: risk.likelihood,
                            technical: risk.technical,
                            schedule: risk.schedule,
                            cost: risk.cost,
                            risklevel: $scope.getRisk(risk.likelihood, risk.technical, risk.schedule, risk.cost),
                            riskthreshold: 100*$scope.riskMatrix[risk.likelihood][Math.max(risk.technical, risk.schedule, risk.cost)],
                            assignor: risk.assignor,
                            owner: risk.owner,
                            approver: risk.approver,
                            assessmentdate: risk.assessmentdate
                        };    
                    });
                    
                    $scope.risks = response.data.Result;
                    return response.data.Result;
               }
               else{  
                $scope.msg += "<br />" + $sce.trustAsHtml(response.data);
               }
            });
        });
      }                                   
}]);