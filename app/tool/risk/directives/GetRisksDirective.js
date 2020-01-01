angular.module(Risk).directive(getRisks, getRisks); 

function getRisks(){
     return {
            restrict: E,
            controller: function ($scope, $element, $attrs, $http, $sce, $stateParams, $timeout){
                  return $http.get(/api/riskconfig).then(function(response){
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
                 return $http.get(api/risks).then(function(response){
                   if (response.data.Succeeded){
                        $scope.ctrl.risks = [];
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
                                risklevel: $scope.ctrl.getRisk(risk.likelihood, risk.technical, risk.schedule, risk.cost),
                                riskthreshold: 100*$scope.ctrl.riskMatrix[risk.likelihood][Math.max(risk.technical, risk.schedule, risk.cost)],
                                assignor: risk.assignor,
                                owner: risk.owner,
                                approver: risk.approver,
                                assessmentdate: risk.assessmentdate
                            };
                            $scope.ctrl.risks.push({
                                riskid: ,
                                risktitle: ,
                                risklevel: ,
                                riskvalue: ,
                                assignor: ,
                                owner: ,
                                altowner: ,
                                approver: ,
                                creationdate: 
                            });
                            $scope.ctrl.risks[key].riskid =  response.data.Result[key].riskid;
                            $scope.ctrl.risks[key].risktitle = response.data.Result[key].risktitle;
                            $scope.ctrl.risks[key].risklevel = response.data.Result[key].risklevel.level;
                            $scope.ctrl.risks[key].riskvalue = response.data.Result[key].risklevel.threshold; 
                            $scope.ctrl.risks[key].assignor = response.data.Result[key].assignor;
                            $scope.ctrl.risks[key].owner = response.data.Result[key].owner;
                            $scope.ctrl.risks[key].approver = response.data.Result[key].approver;
                            $scope.ctrl.risks[key].creationdate = response.data.Result[key].assessmentdate;
                        });
                        $scope.ctrl.risksloaded = true;
                        
                        
                        // lookup the container we want the Grid to use
                        var eGridDiv = document.querySelector(#myGrid);

                        // create the grid passing in the div to use together with the columns & data we want to use
                        new agGrid.Grid(eGridDiv, $scope.ctrl.gridOptions);
                        $scope.ctrl.gridOptions.api.setRowData($scope.ctrl.risks);
                        return response.data.Result;
                   }
                   else{  
                    $scope.ctrl.msg += "<br />" + $sce.trustAsHtml(response.data);
                   }
                });
            });
         }
     }
}