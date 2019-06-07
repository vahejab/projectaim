angular.module('Risk').directive('getRisk', getRisk); 

function getRisk(){
     return {
            restrict: 'E',
            controller: function ($scope, $element, $attrs, $http, $sce, $stateParams){
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
                     
                        return response.data.Result;
                        
                   }
                   else{
                        $scope.ctrl.msg = $sce.trustAsHtml(response.data);
                   }
               }).then(function(){
                    return $http.get('api/users').then(function(response){
                            if (response.data.Succeeded){
                            
                               for (var key = 0; key < response.data.Result.length; key++){
                                    user = response.data.Result[key];     
                                    $scope.ctrl.users.push({id: user.id, value: user.name});
                               }
                               $scope.ctrl.userDone = true;
                               return response.data.Result;
                            }
                            else{
                                 $scope.ctrl.msg += "<br />"+ $sce.trustAsHtml(response.data);
                            }
                   }); 
               }).then(function(){ 
                    return $http.get('api/risks/'+$stateParams.id).then(function(response){
                      if (response.data.Succeeded){  
                            $scope.ctrl.risk.riskid = response.data.Results.riskid;
                            $scope.ctrl.risk.risktitle = response.data.Results.risktitle;
                            $scope.ctrl.risk.status = response.data.Results.status;
                            
                            likelihood = response.data.Results.likelihood;
                            technical = response.data.Results.technical;
                            scheudle = response.data.Results.schedule;
                            cost = response.data.Results.cost;
                            
                            $scope.ctrl.risk.risklevel = $scope.ctrl.getRisk(likelihood, technical, scheudle, cost);
                            $scope.ctrl.risk.assignor = response.data.Results.assignorid;
                            $scope.ctrl.risk.owner = response.data.Results.ownerid;
                            $scope.ctrl.risk.approver = response.data.Results.approverid;
                            $scope.ctrl.risk.assessmentdate = response.data.Results.assessmentdate;
                            $scope.ctrl.risk.risktitle = response.data.Results.risktitle;
                            $scope.ctrl.risk.riskstatement = response.data.Results.riskstatement;
                            $scope.ctrl.risk.context = response.data.Results.context;
                            $scope.ctrl.risk.closurecriteria = response.data.Results.closurecriteria;
                            $scope.ctrl.risk.approvernotes = response.data.Results.approvernotes;
                            $scope.ctrl.risk.ownercomments = response.data.Results.ownercomments;
                            $scope.ctrl.initDone = true;
                            return response.data.Results;
                      }
                      else{
                         $scope.ctrl.msg += "<br />"+$sce.trustAsHtml(response.data);
                      }
                }); 
            });
         }
     }
}