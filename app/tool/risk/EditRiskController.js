angular.module('Risk').controller('EditRiskController', ['$http', '$resource', '$stateParams', '$location', '$scope', '$state', '$timeout', '$sce', 'CommonService', 'DOMops', 'ValidationService',/*'DTOptionsBuilder',*/ 
    function($http, $resource, $stateParams, $location, $scope, $state, $timeout, $sce, CommonService, DOMops, ValidationService/*, DTOptionsBuilder*/){
        var ctrl = this;
              
        ctrl.DOMops = DOMops;
        ctrl.ValidationService = ValidationService;
        ctrl.CommonService = CommonService;
        ctrl.risklevels = {};
        ctrl.riskMatrix = new Array(6);
        ctrl.users = [];
        ctrl.risk = {};
        ctrl.event = [{valid: true}];
        ctrl.initDone = false;
        ctrl.disabled = [{value: true},{value: false},{value: true},{value: true},{value: true},{value: true}];
        
        
          ctrl.today = function() {
            ctrl.dt = new Date();
          };
          ctrl.today();

          ctrl.clear = function() {
            ctrl.dt = null;
          };

          ctrl.inlineOptions = {
            customClass: getDayClass,
            minDate: new Date(),
            showWeeks: true
          };

          ctrl.dateOptions = {
            dateDisabled: disabled,
            formatYear: 'yy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(),
            startingDay: 1
          };

          // Disable weekend selection
          function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
          }

          ctrl.toggleMin = function() {
            ctrl.inlineOptions.minDate = ctrl.inlineOptions.minDate ? null : new Date();
            ctrl.dateOptions.minDate = ctrl.inlineOptions.minDate;
          };

          ctrl.toggleMin();

          
          ctrl.hidepopups = function(){
             ctrl.actual = {
                1:{opened: false},
                2:{opened: false},
                3:{opened: false},
                4:{opened: false},
                5:{opened: false}  
              }
               
              ctrl.schedule = {
                1:{opened: false},
                2:{opened: false},
                3:{opened: false},
                4:{opened: false},
                5:{opened: false}  
              }
          }
          
          ctrl.openActual = function(evt) {
            ctrl.hidepopups();
            ctrl.actual[evt].opened = true;
          };

          ctrl.openSchedule = function(evt) {
            ctrl.hidepopups();
            ctrl.schedule[evt].opened = true;
          };

          ctrl.setDate = function(year, month, day) {
            ctrl.dt = new Date(year, month, day);
          };

          ctrl.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
          ctrl.altInputFormats = ['M!/d!/yyyy'];
          ctrl.format = 'MM/dd/yyyy';
                         
          
          ctrl.actual = {
            1:{opened: false},
            2:{opened: false},
            3:{opened: false},
            4:{opened: false},
            5:{opened: false}  
          }
           
          ctrl.schedule = {
            1:{opened: false},
            2:{opened: false},
            3:{opened: false},
            4:{opened: false},
            5:{opened: false}  
          }
          
          
          var tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          var afterTomorrow = new Date();
          afterTomorrow.setDate(tomorrow.getDate() + 1);
          ctrl.events = [
            {
              date: tomorrow,
              status: 'full'
            },
            {
              date: afterTomorrow,
              status: 'partially'
            }
          ];

          function getDayClass(data) {
            var date = data.date,
              mode = data.mode;
            if (mode === 'day') {
              var dayToCheck = new Date(date).setHours(0,0,0,0);

              for (var i = 0; i < ctrl.events.length; i++) {
                var currentDay = new Date(ctrl.events[i].date).setHours(0,0,0,0);

                if (dayToCheck === currentDay) {
                  return ctrl.events[i].status;
                }
              }
            }

            return '';
          }
          
        for (l = 1; l <= 5; l++)
        {
            ctrl.riskMatrix[l] = new Array(6);
            for (c = 1; c <= 5; c++)
                ctrl.riskMatrix[l][c] = 0;
        }
        
        ctrl.getRisk = function(l, t, s, c){
            return ctrl.riskMatrix[l][Math.max(Math.max(t, s), c)];
        }
        
        ctrl.getLevel = function(risk, l, t, s, c, cons){
           if (risk >= ctrl.risklevels.riskhigh)                                                                                      
               return  {level: 'H ' + l + '-' + cons, likelihood: l, technical: t, schedule: s, cost: c, cls: 'high', threshold: risk};
           else if (risk < ctrl.risklevels.riskhigh  && risk >= ctrl.risklevels.riskmedium)
                return {level: 'M ' + l + '-' + cons, likelihood: l, technical: t, schedule: s, cost: c, cls: 'med', threshold: risk};
           else if (risk < ctrl.risklevels.riskmedium)
                return {level: 'L ' + l + '-' + cons, likelihood: l, technical: t, schedule: s, cost: c, cls: 'low', threshold: risk};
        }
        
        ctrl.saveEvents = function(){   
            evts= [];
            evts[0] = {
                eventid : 0,
                eventtitle : 'Risk Identified',
                ownerid : ctrl.risk.owner,
                actualdate : ctrl.risk.assessmentdate,
                scheduledate : ctrl.risk.assessmentdate,
                scheduledlikelihood : ctrl.risk.likelihood,
                scheduledtechnical : ctrl.risk.technical,
                scheduledschedule : ctrl.risk.schedule,
                scheduledcost : ctrl.risk.cost
            }
                
            for (var idx = 1; idx <= ctrl.lastEventIdSaved; idx++)
            {
                evts.push(ctrl.event[idx]);    
            }

            payload = {riskid: ctrl.risk.riskid, events: evts}
        
            $http.put('/api/risks/'+ ctrl.risk.riskid + '/events', payload).then(function(response){
                    if (response.data.Succeeded){
                        $scope.msg = response.data.Result;
                        return response.data.Result;
                    }
                    else{
                         $scope.msg = $sce.trustAsHtml(response.data);
                    }
            });
        }

        ctrl.submit = function(){
            if (!ctrl.valid())
                 ctrl.msg = "Please complete form and resubmit";
            else 
                return $http.put('/api/risks', ctrl.risk).then(function(response){
                    if (response.data.Succeeded){
                        $scope.msg = response.data.Result;
                        return response.data.Result;
                    }
                    else{
                         $scope.msg = $sce.trustAsHtml(response.data);
                    }
                });
        }
        
        ctrl.validateEvent = function(evt){
            ValidationService.evtValid(evt, $scope);
            l = ctrl.event[evt].scheduledlikelihood;
            t = ctrl.event[evt].scheduledtechnical;
            s = ctrl.event[evt].scheduledschedule;
            c = ctrl.event[evt].scheduledcost;
            cons = Math.max(t, Math.max(s, c));
            
            if (ValidationService.riskIsValid(l, t, s, c))
                 DOMops.displayLevel(ctrl.riskMatrix[l][cons], l, c, evt, $scope);
        }
        
        
         ctrl.disable = function(evt){
            ctrl.disabled[evt].value = true;
        }
        
        ctrl.enable = function(evt){ 
           ctrl.disabled[evt].value = false;
           elems = document.querySelectorAll(".evt"+evt);
            for(var idx = 0; idx < elems.length; idx++)                    
            {
                elem = elems[idx];
                id = elem.getAttribute("id");
            } 
        }
        
         ctrl.add = function(evt){
          
            if (evt < 5)
            {
              ctrl.event.push({
                eventtitle: '',
                ownerid: '',
                actualdate: '',
                scheduledate: '',
                scheduledlikelihood: '',
                scheduledtechnical: '',
                scheduledschedule: '',
                scheduledcost: ''
              });
             ctrl.disable(evt);
             ctrl.enable(evt+1);
             ctrl.lastEventIdSaved++;
            }  
        }                         
     
        ctrl.remove = function(evt){
            if (evt != 1)            
                ctrl.disable(evt);
            
            ctrl.clear(evt);   
            DOMops.clearLevel(evt);
            ctrl.event.pop();
      
            if (evt == 1)
                return; 
            ctrl.enable(evt - 1);
                                      
            if (ctrl.lastEventIdSaved != 0) 
            {
                ctrl.complete[ctrl.lastEventIdSaved--] = {value: true}
            }
        }
        
        ctrl.getEvents = function(riskid){
             return $http.get('api/risks/'+riskid+'/events').then(function(response){
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
        }
       
        ctrl.getRiskDetails = function(nav){
              if (!isNaN(nav))
                id = nav;
              else
                id = $scope.ctrl.risk.riskid + '/' + nav;     
              return $http.get('api/risks/'+id).then(function(response){
                  if (response.data.Succeeded){  
                        $scope.ctrl.risk.riskid = response.data.Result.riskid;
                        $scope.ctrl.risk.risktitle = response.data.Result.risktitle;
                        $scope.ctrl.risk.status = response.data.Result.status;
                        
                        likelihood = response.data.Result.likelihood;
                        technical = response.data.Result.technical;
                        schedule = response.data.Result.schedule;
                        cost = response.data.Result.cost;
                        
                        $scope.ctrl.risk.risklevel = $scope.ctrl.getRisk(likelihood, technical, schedule, cost);
                        $scope.ctrl.risk.level = $scope.ctrl.getLevel($scope.ctrl.risk.risklevel, likelihood, technical, schedule, cost, Math.max(Math.max(technical, schedule), cost));
                        $scope.ctrl.risk.assignorname = response.data.Result.assignor;
                        $scope.ctrl.risk.ownername = response.data.Result.owner;
                        $scope.ctrl.risk.creatorname = response.data.Result.creator;
                        $scope.ctrl.risk.approvername = response.data.Result.approver;
                   
                        $scope.ctrl.risk.assignor = response.data.Result.assignorid;
                        $scope.ctrl.risk.owner = response.data.Result.ownerid;
                        $scope.ctrl.risk.creator = response.data.Result.creatorid;
                        $scope.ctrl.risk.approver = response.data.Result.approverid;
  
                        $scope.ctrl.risk.likelihood = response.data.Result.likelihood;
                        $scope.ctrl.risk.technical = response.data.Result.technical;
                        $scope.ctrl.risk.schedule = response.data.Result.schedule;
                        $scope.ctrl.risk.cost = response.data.Result.cost;
                        $scope.ctrl.risk.assessmentdate = response.data.Result.assessmentdate;
                        $scope.ctrl.risk.risktitle = response.data.Result.risktitle;
                        $scope.ctrl.risk.riskstatement = response.data.Result.riskstatement;
                        $scope.ctrl.risk.context = response.data.Result.context;
                        $scope.ctrl.risk.closurecriteria = response.data.Result.closurecriteria;
                        $scope.ctrl.risk.approvernotes = response.data.Result.approvernotes;
                        $scope.ctrl.risk.ownercomments = response.data.Result.ownercomments;
                        return response.data.Result;
                  }
                  else{
                     $scope.ctrl.msg += "<br />"+$sce.trustAsHtml(response.data);
                  }
            });
        }
           
        
        ctrl.getUsers = function(){
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
        }
        
        ctrl.getRiskConfig = function(){
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
               });
        }
        
        ctrl.fetchRisk = function(page){
            return ctrl.getRiskConfig()
                        .then(()=>{ctrl.getUsers()
                            .then(()=>{ctrl.getRiskDetails(page)
                                .then(()=>{ctrl.getEvents(ctrl.risk.riskid)
                                })
                            })  
                        });
        }
               
}]).filter('unquote', function () {
    return function(value) {
        if(!angular.isString(value)) {
            return value;
        }  
        return value.replace(/^['"]+$/g, ''); // you could use .trim, but it's not going to work in IE<9
    };
});;
