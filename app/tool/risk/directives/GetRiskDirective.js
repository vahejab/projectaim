angular.module('Risk').directive('getRisk', getRisk); 
 
function getRisk(){
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
                    return $http.get('api/users').then(function(response){
                            if (response.data.Succeeded){
                               //$scope.ctrl.users.push({id: 0, value: ''});
                               for (var key = 0; key < response.data.Result.length; key++){
                                    user = response.data.Result[key];     
                                    $scope.ctrl.users[user.id] = {id: user.id, name: user.name};
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
                            schedule = response.data.Results.schedule;
                            cost = response.data.Results.cost;
                            
                            $scope.ctrl.risk.risklevel = $scope.ctrl.getRisk(likelihood, technical, schedule, cost);
                            $scope.ctrl.risk.level = $scope.ctrl.getLevel($scope.ctrl.risk.risklevel, likelihood, technical, schedule, cost, Math.max(Math.max(technical, schedule), cost));
                            $scope.ctrl.risk.assignorname = response.data.Results.assignor;
                            $scope.ctrl.risk.ownername = response.data.Results.owner;
                            $scope.ctrl.risk.creatorname = response.data.Results.creator;
                            $scope.ctrl.risk.approvername = response.data.Results.approver;
                       
                            $scope.ctrl.risk.assignor = response.data.Results.assignorid;
                            $scope.ctrl.risk.owner = response.data.Results.ownerid;
                            $scope.ctrl.risk.creator = response.data.Results.creatorid;
                            $scope.ctrl.risk.approver = response.data.Results.approverid;
      
                            $scope.ctrl.risk.likelihood = response.data.Results.likelihood;
                            $scope.ctrl.risk.technical = response.data.Results.technical;
                            $scope.ctrl.risk.schedule = response.data.Results.schedule;
                            $scope.ctrl.risk.cost = response.data.Results.cost;
                            $scope.ctrl.risk.assessmentdate = response.data.Results.assessmentdate;
                            $scope.ctrl.risk.risktitle = response.data.Results.risktitle;
                            $scope.ctrl.risk.riskstatement = response.data.Results.riskstatement;
                            $scope.ctrl.risk.context = response.data.Results.context;
                            $scope.ctrl.risk.closurecriteria = response.data.Results.closurecriteria;
                            $scope.ctrl.risk.approvernotes = response.data.Results.approvernotes;
                            $scope.ctrl.risk.ownercomments = response.data.Results.ownercomments;
                            return response.data.Results;
                      }
                      else{
                         $scope.ctrl.msg += "<br />"+$sce.trustAsHtml(response.data);
                      }
                }).then(function(){
                   return $http.get('api/risks/'+$stateParams.id+'/events').then(function(response){
                        if (response.data.Succeeded){
                            for (var key = 0; key <= response.data.Result.length-1; key++){
                                event = response.data.Result[key];
                                $scope.ctrl.event.push({});
                                $scope.ctrl.event[key].eventid = key;
                                $scope.ctrl.event[key].eventtitle = event.eventtitle;
                                $scope.ctrl.event[key].riskid = event.riskid;
                                $scope.ctrl.event[key].ownerid = event.ownerid;
                                $scope.ctrl.event[key].actualdate = event.actualdate;
                                $scope.ctrl.event[key].scheduledate = event.scheduledate;
                                $scope.ctrl.event[key].scheduledlikelihood = event.scheduledlikelihood;
                                $scope.ctrl.event[key].scheduledtechnical = event.scheduledtechnical;
                                $scope.ctrl.event[key].scheduledschedule = event.scheduledschedule;
                                $scope.ctrl.event[key].scheduledcost = event.scheduledcost;
                             }
                             if (response.data.Result.length)
                                $scope.ctrl.lastEventIdSaved = response.data.Result.length-1;
                             else
                                $scope.ctrl.lastEventIdSaved = 0;
                             $scope.ctrl.eventsdone = true;   
                             $scope.ctrl.initDone  = true;   
                        } 
                   });
                });
            });
         }
     }
}