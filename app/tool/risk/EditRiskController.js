angular.module('Risk').controller('EditRiskController', ['$http', '$resource', '$stateParams', '$location', '$scope', '$state', '$timeout', '$sce', 'CommonService', 'DOMops', 'ValidationService',/*'DTOptionsBuilder',*/ 
    function($http, $resource, $stateParams, $location, $scope, $state, $timeout, $sce, CommonService, DOMops, ValidationService/*, DTOptionsBuilder*/){
        var ctrl = this;
              
        ctrl.DOMops = DOMops;
        ctrl.ValidationService = ValidationService;
        ctrl.CommonService = CommonService;
        ctrl.risklevels = {};
        ctrl.riskMatrix = new Array(6);
        ctrl.users = [];
        ctrl.lastEventIdSaved = 0;
        ctrl.event = [];
        ctrl.evts = [];
        ctrl.evtCopy = [];
        ctrl.risk = {};
        ctrl.oldlikelihood=0;
        ctrl.oldtechnical=0;
        ctrl.oldschedule=0;
        ctrl.oldcost=0;
        ctrl.initDone = false;
        ctrl.disabled = [{value: true},{value: false},{value: true},{value: true},{value: true},{value: true}];
        
        
          ctrl.today = function() {
            ctrl.dt = new Date();
          };
          ctrl.today();

          ctrl.clear = function() {
            ctrl.dt = null;
          };

          
          // Disable weekend selection
          function disabled(data) {
            var date = data.date,
              mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
          }
          
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
              
              ctrl.baseline = {
                1:{opened: false},
                2:{opened: false},
                3:{opened: false},
                4:{opened: false},
                5:{opened: false}  
              }
               
          }  
          
          ctrl.openBaseline = function(evt) {
            ctrl.hidepopups();
            ctrl.baseline[evt].opened = true;
          };

          
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
        
        ctrl.copyEvent = function(){
            ctrl.evts = [];  
            ctrl.evts[0] = {
                eventid : 0,
                eventtitle : 'Risk Identified',
                ownerid : ctrl.risk.owner,
                
                actualdate: ctrl.risk.assessmentdate,
                actuallikelihood : ctrl.risk.likelihood,
                actualtechnical : ctrl.risk.technical,
                actualschedule : ctrl.risk.schedule,
                actualcost : ctrl.risk.cost,
      
                
                scheduledate : ctrl.risk.assessmentdate,
                scheduledlikelihood : ctrl.risk.likelihood,
                scheduledtechnical : ctrl.risk.technical,
                scheduledschedule : ctrl.risk.schedule,
                scheduledcost : ctrl.risk.cost,
                
                baselinedate : ctrl.risk.assessmentdate,
                baselinelikelihood : ctrl.risk.likelihood,
                baselinetechnical : ctrl.risk.technical,
                baselineschedule : ctrl.risk.schedule,
                baselinecost : ctrl.risk.cost
            }


            ctrl.evtCopy[0] = JSON.parse(JSON.stringify(ctrl.evts[0]));                             
            for (var idx = 1; idx <= ctrl.lastEventIdSaved; idx++)
            {            
                ctrl.evtCopy[idx] = JSON.parse(JSON.stringify(ctrl.event[idx]));
            }
        }
                    
        ctrl.saveEvents = function(){ 
        
            ctrl.copyEvent();
            for (var idx = 1; idx <= ctrl.lastEventIdSaved; idx++)
            {            
                ctrl.evtCopy[idx].baselinedate = ctrl.evtCopy[idx].scheduledate || null;
                ctrl.evtCopy[idx].baselinelikelihood = ctrl.evtCopy[idx].scheduledlikelihood;
                ctrl.evtCopy[idx].baselinetechnical = ctrl.evtCopy[idx].scheduledtechnical;
                ctrl.evtCopy[idx].baselineschedule = ctrl.evtCopy[idx].scheduledschedule;
                ctrl.evtCopy[idx].baselinecost = ctrl.evtCopy[idx].scheduledcost;
        
                ctrl.evtCopy[idx].actualdate = ctrl.evtCopy[idx].scheduledate || null;
                ctrl.evtCopy[idx].actuallikelihood = ctrl.evtCopy[idx].scheduledlikelihood;
                ctrl.evtCopy[idx].actualtechnical = ctrl.evtCopy[idx].scheduledtechnical;
                ctrl.evtCopy[idx].actualschedule = ctrl.evtCopy[idx].scheduledschedule;
                ctrl.evtCopy[idx].actualcost = ctrl.evtCopy[idx].scheduledcost;
   
                ctrl.evts.push(ctrl.evtCopy[idx]);
                ctrl.evts[idx].eventid = idx;
                if (ctrl.evtCopy[idx].actualdate != null)
                {  
                    act = new Date(ctrl.evtCopy[idx].actualdate);
                    y = act.getFullYear();
                    m = act.getMonth()+1;
                    d = act.getDate();
                    ctrl.evts[idx].actualdate = y+((m<10)?'-0'+m:'-'+m)+((d<10)?'-0'+d:'-'+d);              
                }
                
                if (ctrl.evtCopy[idx].baselinedate != null)
                {  
                    act = new Date(ctrl.evtCopy[idx].baselinedate);
                    y = act.getFullYear();
                    m = act.getMonth()+1;
                    d = act.getDate();
                    ctrl.evts[idx].baselinedate = y+((m<10)?'-0'+m:'-'+m)+((d<10)?'-0'+d:'-'+d);                
                }
                
                if (ctrl.evtCopy[idx].scheduledate != null)
                {
                    sch = new Date(ctrl.evtCopy[idx].scheduledate);
                    y = sch.getFullYear();
                    m = sch.getMonth()+1;
                    d = sch.getDate();
                    ctrl.evts[idx].scheduledate = y+((m<10)?'-0'+m:'-'+m)+((d<10)?'-0'+d:'-'+d);
                }
            }   
            payload = {riskid: ctrl.risk.riskid, events: ctrl.evts}

            return $http.put('/api/risks/'+ ctrl.risk.riskid + '/events', payload).then(function(response){
                    if (response.data.Succeeded){
                        ctrl.msg = response.data.Result;
                    }
                    else{
                         ctrl.msg = $sce.trustAsHtml(response.data);
                    }
            }).then(function(){
                ctrl.rebindDates();   
            });
        }
        
        ctrl.rebindDates = function(){
          for(e = 1; e <= ctrl.lastEventIdSaved; e++){
            ctrl.rebindDate(e);                    
          }        
        } 
   
        ctrl.rebindbaseline = function(e){
            if (ctrl.evtCopy[e] && ctrl.evtCopy[e].baselinedate != null)
            {
                    ymd = ctrl.evtCopy[e].baselinedate.split('-');
                    y = ymd[0];
                    m = ymd[1];
                    d = ymd[2];
                    ctrl.event[e].baselinedate = new Date(y,m-1,d);      
            }          
        }
        
        ctrl.rebindschedule = function(e){
            if (ctrl.evtCopy[e] && ctrl.evtCopy[e].scheduledate != null)
            {
                    ymd = ctrl.evtCopy[e].scheduledate.split('-');
                    y = ymd[0];
                    m = ymd[1];
                    d = ymd[2];
                    ctrl.event[e].scheduledate = new Date(y,m-1,d);          
            }
        }
        
        ctrl.rebindactual = function(e){
            if (ctrl.evtCopy[e] && ctrl.evtCopy[e].actualdate != null)
            {
                    ymd = ctrl.evtCopy[e].actualdate.split('-');
                    y = ymd[0];
                    m = ymd[1];
                    d = ymd[2];
                    ctrl.event[e].actualdate = new Date(y,m-1,d);          
            }
        }    
        
        ctrl.rebindDate = function(e){
            ctrl.rebindschedule(e);
            ctrl.rebindactual(e);
            ctrl.rebindbaseline(e);
        }        
        

        ctrl.setBaselineDate = function(evt){
            if (typeof ctrl.event[evt].baselinedate === 'undefined')
            {
                dt = ctrl.event[evt].scheduledate;
                y = dt.getFullYear();
                m = dt.getMonth();
                d = dt.getDate();
                ctrl.event[evt].baselinedate = new Date(y,m,d); 
            } 
        }
        ctrl.valid = function(){
            return !(ctrl.risk.risktitle.trim() == '' && ctrl.risk.riskstatement.trim() == '' && ctrl.risk.context.trim() == '');
        }
       
        ctrl.submit = function(){
            if (!ctrl.valid())
                 ctrl.msg = "Please complete form and resubmit";
            else 
                return $http.put('/api/risks', ctrl.risk).then(function(response){
                    if (response.data.Succeeded){
                        ctrl.msg = response.data.Result;
                        return response.data.Result;
                    }
                    else{
                         ctrl.msg = $sce.trustAsHtml(response.data);
                    }
                });
        }
        
        ctrl.displayLevel = function(evt){
       
            if (ctrl.event[evt] && (evt <= ctrl.lastEventIdSaved || ValidationService.evtValid(evt, $scope))){
                l = ctrl.event[evt].scheduledlikelihood;
                t = ctrl.event[evt].scheduledtechnical;
                s = ctrl.event[evt].scheduledschedule;
                c = ctrl.event[evt].scheduledcost;
                cons = Math.max(t, Math.max(s, c));
                
                if (l && t && s && c)
                    if (ValidationService.riskIsValid(l, t, s, c))
                        DOMops.displayLevel(ctrl.riskMatrix[l][cons], l, c, evt, $scope);
            }
        }
        
        ctrl.validateDisplayLevel = function(evt){
            ctrl.validateEvent(evt); 
            ctrl.displayLevel(evt);
        }
        
        ctrl.validateEvent = function(evt){
            ValidationService.evtValid(evt, $scope);
        }
        
        ctrl.validateLevel = function(evt){
             ctrl.displayLevel(evt);
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
                if (evt < 5 && ctrl.event.length > 0)
                {
                      ctrl.event.push({
                        eventid: evt+1,
                        eventtitle: '',
                        ownerid: '',
                        actualdate: '',
                        scheduledate: '',
                        scheduledlikelihood: '',
                        scheduledtechnical: '',
                        scheduledschedule: '',
                        scheduledcost: '',
                      inlineActualOptions: {
                        customClass: getDayClass,
                        minDate: ctrl.event[evt].actualdate,
                        showWeeks: true
                      },
                      inlineScheduleOptions: {
                        customClass: getDayClass,
                        minDate: ctrl.event[evt].scheduledate,
                        showWeeks: true
                      },
                      actualdateOptions:{
                        dateDisabled: disabled,
                        formatYear: 'yy',
                        minDate: ctrl.event[evt].actualdate,  
                        startingDay: 1
                      },
                      scheduledateOptions:{
                        dateDisabled: disabled,
                        formatYear: 'yy',
                        minDate: ctrl.event[evt].scheduledate,             
                        startingDay: 1
                    }
               });   
                ctrl.disable(evt);
                ctrl.enable(evt+1);
                
                if (ctrl.event[evt].valid)
                    ctrl.lastEventIdSaved++;
             }  
        } 
        
        
        ctrl.clearEvent = function(evt){
            ctrl.event[evt] = 
                    {eventtitle: '',
                        ownerid: '',
                        actualdate: '',
                        scheduledate: '',
                        scheduledlikelihood: '',
                        scheduledtechnical: '',
                        scheduledschedule: '',
                        scheduledcost: ''}
        }
        
        ctrl.remove = function(evt){
            if (evt != 1)            
                ctrl.disable(evt);
            
            ctrl.clearEvent(evt);   
            DOMops.clearLevel(evt);
            ctrl.event.pop();
                                                  
            ctrl.lastEventIdSaved--;
            if (evt == 1)
                return; 
            ctrl.enable(evt - 1);
            ctrl.validateEvent(evt-1);
        }
        
        
        ctrl.getEvents = function(riskid){
             ctrl.evts = [];
             ctrl.event = [];
             ctrl.evtCopy = [];
             for (evt = 0; evt <= 5; evt++)
                DOMops.clearLevel(evt);
             return $http.get('api/risks/'+riskid+'/events').then(function(response){
                    if (response.data.Succeeded){
                        for (var key = 0; key <= response.data.Result.length-1; key++){
                            event = response.data.Result[key];
                            ctrl.event.push({});
                            ctrl.event[key].eventid = key;
                            ctrl.event[key].eventtitle = event.eventtitle;
                            ctrl.event[key].riskid = event.riskid;
                            ctrl.event[key].ownerid = event.ownerid;
                            ctrl.event[key].actualdate = event.actualdate;
                            ctrl.event[key].scheduledate = event.scheduledate;
                            ctrl.event[key].scheduledlikelihood = event.scheduledlikelihood;
                            ctrl.event[key].scheduledtechnical = event.scheduledtechnical;
                            ctrl.event[key].scheduledschedule = event.scheduledschedule;
                            ctrl.event[key].scheduledcost = event.scheduledcost;
                         }
                         if (response.data.Result.length)
                            ctrl.lastEventIdSaved = response.data.Result.length-1;
                         else
                            ctrl.lastEventIdSaved = 0;
                         ctrl.add(ctrl.lastEventIdSaved);
                         
                         ctrl.copyEvent();
                         
                         ctrl.eventsdone = true;   
                         ctrl.initDone  = true;
                    }
                    return response.data.Result;
               });//then(() => {ctrl.rebindDates();});
        }
       
        ctrl.getRiskDetails = function(nav){
             if ($stateParams.id != null){
                route = $stateParams.id;
                $stateParams.id = null;
             }
             else if (!isNaN(nav))
                route = nav;
             else if (nav && isNaN(nav))
                route = (localStorage.riskid || $stateParams.id) + '/' + nav;     
             else if (!nav)
                route = localStorage.riskid || $stateParams.id || 'first';
    
            return $http.get('api/risks/'+route).then(function(response){
                  if (response.data.Succeeded){  
                        ctrl.risk.riskid = response.data.Result.riskid;
                        ctrl.riskid = ctrl.risk.riskid;
                        
                        localStorage.setItem('riskid', ctrl.riskid);
           
                        ctrl.risk.risktitle = response.data.Result.risktitle;
                        ctrl.risk.status = response.data.Result.status;
                        
                        likelihood = response.data.Result.likelihood;
                        technical = response.data.Result.technical;
                        schedule = response.data.Result.schedule;
                        cost = response.data.Result.cost;
                        
                        ctrl.risk.risklevel = ctrl.getRisk(likelihood, technical, schedule, cost);
                        ctrl.risk.level = ctrl.getLevel(ctrl.risk.risklevel, likelihood, technical, schedule, cost, Math.max(Math.max(technical, schedule), cost));
                        ctrl.risk.assignorname = response.data.Result.assignor;
                        ctrl.risk.ownername = response.data.Result.owner;
                        ctrl.risk.creatorname = response.data.Result.creator;
                        ctrl.risk.approvername = response.data.Result.approver;
                   
                        ctrl.risk.assignor = response.data.Result.assignorid;
                        ctrl.risk.owner = response.data.Result.ownerid;
                        ctrl.risk.creator = response.data.Result.creatorid;
                        ctrl.risk.approver = response.data.Result.approverid;
  
                        ctrl.risk.likelihood = response.data.Result.likelihood;
                        ctrl.risk.technical = response.data.Result.technical;
                        ctrl.risk.schedule = response.data.Result.schedule;
                        ctrl.risk.cost = response.data.Result.cost;
                        ctrl.risk.assessmentdate = response.data.Result.assessmentdate;
                        ctrl.risk.risktitle = response.data.Result.risktitle;
                        ctrl.risk.riskstatement = response.data.Result.riskstatement;
                        ctrl.risk.context = response.data.Result.context;
                        ctrl.risk.closurecriteria = response.data.Result.closurecriteria;
                        ctrl.risk.approvernotes = response.data.Result.approvernotes;
                        ctrl.risk.ownercomments = response.data.Result.ownercomments;
                        return response.data.Result;
                  }
                  else{
                     ctrl.msg += "<br />"+$sce.trustAsHtml(response.data);
                  }
            });
        }
           
        
        ctrl.getUsers = function(){
            return $http.get('api/users').then(function(response){
                    if (response.data.Succeeded){
                       //ctrl.users.push({id: 0, value: ''});
                       for (var key = 0; key < response.data.Result.length; key++){
                            user = response.data.Result[key];     
                            ctrl.users[user.id] = {id: user.id, name: user.name};
                       }
                       ctrl.userDone = true;
                       return response.data.Result;
                    }
                    else{
                         ctrl.msg += "<br />"+ $sce.trustAsHtml(response.data);
                    }
           }); 
        }
        
        ctrl.getRiskConfig = function(){
            return $http.get('/api/riskconfig').then(function(response){
                   if (response.data.Succeeded){
                        ctrl.risklevels.riskmaximum = response.data.Result.Levels[0].riskmaximum;
                        ctrl.risklevels.riskhigh = response.data.Result.Levels[0].riskhigh;
                        ctrl.risklevels.riskmedium = response.data.Result.Levels[0].riskmedium;
                        ctrl.risklevels.riskminimum = response.data.Result.Levels[0].riskminimum; 
                    
                     
                        for (var idx = 0; idx < response.data.Result.Thresholds.length; idx++)
                        {
                            var l = response.data.Result.Thresholds[idx].likelihood;
                            var c = response.data.Result.Thresholds[idx].consequence;
                            v = response.data.Result.Thresholds[idx].level;
                            ctrl.riskMatrix[l][c] = v;
                        }
                     
                        return response.data.Result;
                        
                   }
                   else{
                        ctrl.msg = $sce.trustAsHtml(response.data);
                   }
               });
        }
        
        ctrl.displayLevels = function(){
            ctrl.levelsready = false;
            for (e = 1; e < ctrl.event.length; e++)
                ctrl.displayLevel(e);
            ctrl.levelsready = true;
        }
        
        ctrl.fetchRisk = function(page){
                return ctrl.getRiskConfig()
                        .then(()=> {return ctrl.getUsers()
                            .then(()=>{return ctrl.getRiskDetails(page)
                                .then(()=>{return ctrl.getEvents(ctrl.risk.riskid);
                            });  
                        });
                   }).then(()=>{ctrl.displayLevels();});
        }
               
}]).filter('unquote', function () {
    return function(value) {
        if(!angular.isString(value)) {
            return value;
        }  
        return value.replace(/^['"]+$/g, ''); // you could use .trim, but it's not going to work in IE<9
    };
});;
