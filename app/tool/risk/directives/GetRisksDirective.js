angular.module('Risk').directive('getRisks', getRisks); 
 /*    
function getRisk(){
     return {
            restrict: 'E',
            controller: function ($scope, $element, $attrs, $http, $sce, $stateParams, $timeout){
              return $http.get('/api/riskconfig').then(function(response){
                   if (response.data.Succeeded){
                        $scope.ctrl.ctrl.risklevels.riskmaximum = response.data.Result.Levels[0].riskmaximum;
                        $scope.ctrl.ctrl.risklevels.riskhigh = response.data.Result.Levels[0].riskhigh;
                        $scope.ctrl.ctrl.risklevels.riskmedium = response.data.Result.Levels[0].riskmedium;
                        $scope.ctrl.ctrl.risklevels.riskminimum = response.data.Result.Levels[0].riskminimum; 
                    
                     
                        for (var idx = 0; idx < response.data.Result.Thresholds.length; idx++)
                        {
                            var l = response.data.Result.Thresholds[idx].likelihood;
                            var c = response.data.Result.Thresholds[idx].consequence;
                            v = response.data.Result.Thresholds[idx].level;
                            $scope.ctrl.ctrl.riskMatrix[l][c] = v;
                        }
                     
                        return response.data.Result;
                        
                   }
                   else{
                        $scope.ctrl.ctrl.msg = $sce.trustAsHtml(response.data);
                   }
               }).then(function(){
                    return $http.get('api/users').then(function(response){
                            if (response.data.Succeeded){
                               //$scope.ctrl.ctrl.users.push({id: 0, value: ''});
                               for (var key = 0; key < response.data.Result.length; key++){
                                    user = response.data.Result[key];     
                                    $scope.ctrl.ctrl.users.push({id: user.id, value: user.name});
                               }
                               $scope.ctrl.ctrl.userDone = true;
                               return response.data.Result;
                            }
                            else{
                                 $scope.ctrl.ctrl.msg += "<br />"+ $sce.trustAsHtml(response.data);
                            }
                   }); 
               }).then(function(){ 
                    return $http.get('api/risks/'+$stateParams.id).then(function(response){
                      if (response.data.Succeeded){  
                            $scope.ctrl.ctrl.risk.riskid = response.data.Results.riskid;
                            $scope.ctrl.ctrl.risk.risktitle = response.data.Results.risktitle;
                            $scope.ctrl.ctrl.risk.status = response.data.Results.status;
                            
                            likelihood = response.data.Results.likelihood;
                            technical = response.data.Results.technical;
                            scheudle = response.data.Results.schedule;
                            cost = response.data.Results.cost;
                            
                            $scope.ctrl.ctrl.risk.risklevel = $scope.ctrl.ctrl.getRisk(likelihood, technical, scheudle, cost);
                           
                            $scope.ctrl.ctrl.risk.assignorname = response.data.Results.assignor;
                            $scope.ctrl.ctrl.risk.ownername = response.data.Results.owner;
                            $scope.ctrl.ctrl.risk.creatorname = response.data.Results.creator;
                            $scope.ctrl.ctrl.risk.approvername = response.data.Results.approver;
                       
                            $scope.ctrl.ctrl.risk.assignor = response.data.Results.assignorid;
                            $scope.ctrl.ctrl.risk.owner = response.data.Results.ownerid;
                            $scope.ctrl.ctrl.risk.creator = response.data.Results.creatorid;
                            $scope.ctrl.ctrl.risk.approver = response.data.Results.approverid;
      
                            $scope.ctrl.ctrl.risk.likelihood = response.data.Results.likelihood;
                            $scope.ctrl.ctrl.risk.technical = response.data.Results.technical;
                            $scope.ctrl.ctrl.risk.schedule = response.data.Results.schedule;
                            $scope.ctrl.ctrl.risk.cost = response.data.Results.cost;
                            $scope.ctrl.ctrl.risk.assessmentdate = response.data.Results.assessmentdate;
                            $scope.ctrl.ctrl.risk.risktitle = response.data.Results.risktitle;
                            $scope.ctrl.ctrl.risk.riskstatement = response.data.Results.riskstatement;
                            $scope.ctrl.ctrl.risk.context = response.data.Results.context;
                            $scope.ctrl.ctrl.risk.closurecriteria = response.data.Results.closurecriteria;
                            $scope.ctrl.ctrl.risk.approvernotes = response.data.Results.approvernotes;
                            $scope.ctrl.ctrl.risk.ownercomments = response.data.Results.ownercomments;
                            $scope.ctrl.ctrl.initDone = true;
                            return response.data.Results;
                      }
                      else{
                         $scope.ctrl.ctrl.msg += "<br />"+$sce.trustAsHtml(response.data);
                      }
                }).then(function(){
                   return $http.get('api/risks/'+$stateParams.id+'/events').then(function(response){
                        if (response.data.Succeeded){
                              
                             for (var key = 0; key <= response.data.Result.length-1; key++){
                                event = response.data.Result[key];
                                $scope.ctrl.ctrl.event[key].eventid = key;
                                $scope.ctrl.ctrl.event[key].eventtitle = event.eventtitle;
                                $scope.ctrl.ctrl.event[key].riskid = event.riskid;
                                $scope.ctrl.ctrl.event[key].ownerid = event.ownerid;
                                $scope.ctrl.ctrl.event[key].actualdate = event.actualdate;
                                $scope.ctrl.ctrl.event[key].scheduledate = event.scheduledate;
                                $scope.ctrl.ctrl.event[key].scheduledlikelihood = event.scheduledlikelihood;
                                $scope.ctrl.ctrl.event[key].scheduledtechnical = event.scheduledtechnical;
                                $scope.ctrl.ctrl.event[key].scheduledschedule = event.scheduledschedule;
                                $scope.ctrl.ctrl.event[key].scheduledcost = event.scheduledcost;
                             }
                             if (response.data.Result.length)
                                $scope.ctrl.ctrl.lastEventIdSaved = response.data.Result.length-1;
                             else
                                $scope.ctrl.ctrl.lastEventIdSaved = 0;
                             $scope.ctrl.ctrl.eventsdone = true;      
                        } 
                   });
                });
            });
         }
     }
}
*/
        
function getRisks(){
     return {
            restrict: 'E',
            controller: function ($scope, $element, $attrs, $http, $sce, $stateParams, $timeout){
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
                 return $http.get('api/risks').then(function(response){
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
                                riskid: '',
                                risktitle: '',
                                risklevel: '',
                                riskvalue: '',
                                assignor: '',
                                owner: '',
                                altowner: '',
                                approver: '',
                                creationdate: ''
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
                        var eGridDiv = document.querySelector('#myGrid');

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