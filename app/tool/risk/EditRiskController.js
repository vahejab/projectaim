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
        ctrl.nextActualRiskEventId = 1;
        ctrl.event = [];
        ctrl.evts = [];
        ctrl.evtCopy = [];
        ctrl.risk = {};//0 -> Created, 1 -> Assigned, 2 -> In Progress, 3 -> Completed, 4 -> Closed
        ctrl.oldbaselinedate=0;
        ctrl.oldlikelihood=0;
        ctrl.oldtechnical=0;
        ctrl.oldschedule=0;
        ctrl.oldcost=0;
        ctrl.initDone = false;
        ctrl.levelsready = false;
        ctrl.riskstates = {0: 'Created', 1: 'Assigned', 2: 'In Progress', 3: 'Completed', 4: 'Closed'};
        ctrl.disabled = [{value: true},{value: true},{value: true},{value: true},{value: true},{value: true}];
        ctrl.actual = [{opened: false, disabled: true},{opened: false, disabled: true},{opened: false, disabled: true},{opened: false, disabled: true},{opened: false, disabled: true},{opened: false, disabled: true}];
           
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
             for (e = 1; e <= 5; e++)
             {
               ctrl.actual[e].opened = false;
               ctrl.baseline[e].opened = false;
               ctrl.schedule[e].opened = false;  
                 
             } 
          }  
          
           $scope.init = function(){
                angular.element(document.querySelector('link[href="/app/tool/EditRisk.css"]')).remove();
                angular.element(document.querySelector('link[href="/app/css/bootstrap/bootstrap.min.css"]')).remove();   
                angular.element(document.querySelector('head')).append('<link type="text/css" rel="stylesheet" href="/app/tool/risk/EditRisk.css"/>');
                angular.element(document.querySelector('head')).append('<link type="text/css" rel="stylesheet" href="/app/css/bootstrap/bootstrap.min.css"/>');
                ctrl.fetchRisk();
            }
                        
            $scope.$on("$destroy", function(){
                 formcheck = 0;    
                 angular.element(document.querySelector('link[href="/app/tool/risk/EditRisk.css"]')).remove();
                 angular.element(document.querySelector('link[href="/app/css/bootstrap/bootstrap.min.css"]')).remove();   
            });
          
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
                eventownerid : ctrl.risk.owner,
                
                actualdate: ctrl.risk.assessmentdate,
                actuallikelihood : ctrl.risk.likelihood,
                actualtechnical : ctrl.risk.technical,
                actualschedule : ctrl.risk.schedule,
                actualcost : ctrl.risk.cost,
      
                
                scheduledate : null,
                scheduledlikelihood : null,
                scheduledtechnical : null,
                scheduledschedule : null,
                scheduledcost : null,
                
                baselinedate : ctrl.risk.assessmentdate,
                baselinelikelihood : ctrl.risk.likelihood,
                baselinetechnical : ctrl.risk.technical,
                baselineschedule : ctrl.risk.schedule,
                baselinecost : ctrl.risk.cost
            }


            ctrl.evtCopy[0] = JSON.parse(JSON.stringify(ctrl.evts[0]));
                             
            for (var idx = 1; (ctrl.lastEventIdSaved > 0) && (idx < ctrl.lastEventIdSaved); idx++)
            {            
                ctrl.evtCopy[idx] = JSON.parse(JSON.stringify(ctrl.event[idx]));
                if (!ctrl.evtCopy[idx].hasOwnProperty('actualdate') || ctrl.evtCopy[idx].actualdate == '')
                    ctrl.evtCopy[idx].actualdate = '';
                if (!ctrl.evtCopy[idx].hasOwnProperty('actuallikelihood') || ctrl.evtCopy[idx].actuallikelihood == '')
                    ctrl.evtCopy[idx].actuallikelihood = null;
                if (!ctrl.evtCopy[idx].hasOwnProperty('actualtechnical')|| ctrl.evtCopy[idx].actualtechnical == '')
                    ctrl.evtCopy[idx].actualtechnical = null;
                if (!ctrl.evtCopy[idx].hasOwnProperty('actualschedule')|| ctrl.evtCopy[idx].actualschedule == '')
                    ctrl.evtCopy[idx].actualschedule = null;
                if (!ctrl.evtCopy[idx].hasOwnProperty('actualcost')|| ctrl.evtCopy[idx].actualcost == '')
                    ctrl.evtCopy[idx].actualcost = null;
            
                if (!ctrl.evtCopy[idx].hasOwnProperty('scheduleddate')|| ctrl.evtCopy[idx].scheduleddate == '')
                    ctrl.evtCopy[idx].scheduleddate = '';
                if (!ctrl.evtCopy[idx].hasOwnProperty('scheduledlikelihood')|| ctrl.evtCopy[idx].scheduledlikelihood == '')
                    ctrl.evtCopy[idx].scheduledlikelihood = null;
                if (!ctrl.evtCopy[idx].hasOwnProperty('scheduledtechnical')|| ctrl.evtCopy[idx].scheduledtechnical == '')
                    ctrl.evtCopy[idx].scheduledtechnical = null;
                if (!ctrl.evtCopy[idx].hasOwnProperty('scheduledschedule')|| ctrl.evtCopy[idx].scheduledschedule == '')
                    ctrl.evtCopy[idx].scheduledschedule = null;
                if (!ctrl.evtCopy[idx].hasOwnProperty('scheduledcost')|| ctrl.evtCopy[idx].scheduledcost == '')
                    ctrl.evtCopy[idx].scheduledcost = null;
            
                if (!ctrl.evtCopy[idx].hasOwnProperty('baselinedate')|| ctrl.evtCopy[idx].baselinedate == '')
                    ctrl.evtCopy[idx].baselinedate = '';
                if (!ctrl.evtCopy[idx].hasOwnProperty('baselinelikelihood')|| ctrl.evtCopy[idx].baselinelikelihood == '')
                    ctrl.evtCopy[idx].baselinelikelihood = null;
                if (!ctrl.evtCopy[idx].hasOwnProperty('baselinetechnical')|| ctrl.evtCopy[idx].baselinetechnical == '')
                    ctrl.evtCopy[idx].baselinetechnical = null;
                if (!ctrl.evtCopy[idx].hasOwnProperty('baselineschedule')|| ctrl.evtCopy[idx].baselineschedule == '')
                    ctrl.evtCopy[idx].baselineschedule = null;
                if (!ctrl.evtCopy[idx].hasOwnProperty('baselinecost')|| ctrl.evtCopy[idx].baselinecost == '')
                    ctrl.evtCopy[idx].baselinecost = null;
            
            }
        }
                    
        ctrl.saveEvents = function(){ 
        
            ctrl.copyEvent();
            for (var idx = 1; (ctrl.lastEventIdSaved > 0) && (idx < ctrl.lastEventIdSaved); idx++)
            {            
                ctrl.evts.push(ctrl.evtCopy[idx]);
                ctrl.evts[idx].eventid = idx;
                if (ctrl.evtCopy[idx].hasOwnProperty('actualdate') && ctrl.evtCopy[idx].actualdate != null && ctrl.evtCopy[idx].actualdate != '')
                {  
                    act = new Date(ctrl.evtCopy[idx].actualdate);
                    y = act.getFullYear();
                    m = act.getMonth()+1;
                    d = act.getDate();
                    ctrl.evtCopy[idx].actualdate = y+((m<10)?'-0'+m:'-'+m)+((d<10)?'-0'+d:'-'+d);              
                }
                else
                    ctrl.evts[idx].actualdate = null;
                
                if (ctrl.evtCopy[idx].hasOwnProperty('baselinedate') && ctrl.evtCopy[idx].baselinedate != null && ctrl.evtCopy[idx].baselinedate != '')
                {  
                    act = new Date(ctrl.evtCopy[idx].baselinedate);
                    y = act.getFullYear();
                    m = act.getMonth()+1;
                    d = act.getDate();
                    ctrl.evts[idx].baselinedate = y+((m<10)?'-0'+m:'-'+m)+((d<10)?'-0'+d:'-'+d);                
                }
                else
                    ctrl.evtCopy[idx].baselinedate = null;
                
                if (ctrl.evtCopy[idx].hasOwnProperty('scheduledate') && ctrl.evtCopy[idx].scheduledate != null && ctrl.evtCopy[idx].scheduledate != '')
                {
                    sch = new Date(ctrl.evtCopy[idx].scheduledate);
                    y = sch.getFullYear();
                    m = sch.getMonth()+1;
                    d = sch.getDate();
                    ctrl.evts[idx].scheduledate = y+((m<10)?'-0'+m:'-'+m)+((d<10)?'-0'+d:'-'+d);
                }
                else
                    ctrl.evtCopy[idx].scheduledate = null;
            }   
            payload = {riskid: ctrl.risk.riskid, events: ctrl.evts}
            
            return $http.put('/api/risks/'+ ctrl.risk.riskid + '/events', payload).then(function(response){
                    ctrl.msg = response.data.Result;
                    return response.data.Result;
            }).then(function(){
                ctrl.rebindDates(); 
            });
        }
        
        ctrl.rebindDates = function(){
          for(e = 1; (ctrl.lastEventIdSaved > 0) && (e <= ctrl.lastEventIdSaved); e++){
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
        

        ctrl.setScheduleDate = function(evt){
            if (ctrl.event[evt].hasOwnProperty('scheduledate') || ctrl.event[evt].scheduledate == '' || typeof ctrl.event[evt].scheduledate === 'undefined')
            {
                dt = ctrl.event[evt].baselinedate;
                y = dt.getFullYear();
                m = dt.getMonth();
                d = dt.getDate();
                ctrl.event[evt].scheduledate = new Date(y,m,d); 
            } 
        }
        ctrl.valid = function(){
            return !(ctrl.risk.risktitle.trim() == '' && ctrl.risk.riskstatement.trim() == '' && ctrl.risk.context.trim() == '');
        }
        
        ctrl.updateRisk = function(){
                return $http.put('/api/risks', ctrl.risk).then(function(response){
                    ctrl.msg = response.data.Result;
                    return response.data.Result;
                });     
        }       
            
        ctrl.submit = function(){
            if (!ctrl.valid())
                 ctrl.msg = "Please complete form and resubmit";
            else
                if (ctrl.risk.riskstate != 'Completed')
                {
                   if (ctrl.risk.owner == null)
                        ctrl.risk.riskstate = 'Created';
                   else if (ctrl.risk.owner != null && ctrl.lastEventIdSaved == 0 || (ctrl.lastEventIdSaved == 1 && ctrl.event.length <= 2))
                        ctrl.risk.riskstate = 'Assigned';
                   else if (ctrl.event.length > 1)
                        ctrl.risk.riskstate = 'In Progress';  
                }
            return ctrl.updateRisk();
        }
        
       
        ctrl.completeRisk = function(){
            if (!ctrl.valid())
                 ctrl.msg = "Please complete form and resubmit";
           
            ctrl.risk.riskstate = 'Completed';
            return ctrl.updateRisk();
        }
        
        ctrl.closeRisk = function(){
            if (!ctrl.valid())
                 ctrl.msg = "Please complete form and resubmit";
           
            ctrl.risk.riskstate = 'Closed';
            return ctrl.updateRisk(); 
        }
        
        
        
        
        
        ctrl.riskValid = function(evt, field){
             if (ctrl.event[evt]){
                l = ctrl.event[evt][field+'likelihood'];
                t = ctrl.event[evt][field+'technical'];
                s = ctrl.event[evt][field+'schedule'];
                c = ctrl.event[evt][field+'cost'];
                return ValidationService.riskIsValid(l,t,s,c);
              }
              return false;
        }       

        ctrl.validRiskLevel = function(evt, field){
            if (ctrl.event[evt] && ctrl.event[evt].hasOwnProperty(field+'likelihood') && ctrl.event[evt].hasOwnProperty(field+'technical') && ctrl.event[evt].hasOwnProperty(field+'schedule') && ctrl.event[evt].hasOwnProperty(field+'cost') && evt <= ctrl.lastEventIdSaved +1 /*|| ValidationService.evtValid(evt, $scope)*/){
                l = ctrl.event[evt][field+'likelihood'] || '';
                t = ctrl.event[evt][field+'technical'] || '';
                s = ctrl.event[evt][field+'schedule'] || '';
                c = ctrl.event[evt][field+'cost'] || '';
                cons = Math.max(t, Math.max(s, c));   
                return {l: l, cons: cons, valid: ValidationService.riskIsValid(l, t, s, c)};
            }
            return {valid: false};
        }
        
        ctrl.displayLevel = function(evt, field){
            if (ctrl.validRiskLevel(evt, field).valid)
                return DOMops.displayLevel(ctrl.riskMatrix[l][cons], l, cons, evt, ctrl, field);  
        }  
        
        ctrl.invalidRiskLevel = function(evt, field, attr){
                validLevelEvt = ctrl.validRiskLevel(evt, field);
                validLevelLastEvt = ctrl.validRiskLevel(evt-1, field);
                likelihoodEvt = validLevelEvt.l;
                consequenceEvt = validLevelEvt.cons;
                if (validLevelEvt.valid && validLevelLastEvt.valid)
                {
                   likelihoodLastEvt = validLevelLastEvt.l
                   consequenceLastEvt = validLevelLastEvt.cons;

                    if (ctrl.riskMatrix[likelihoodEvt][consequenceEvt] >= 
                        ctrl.riskMatrix[likelihoodLastEvt][consequenceLastEvt]){
                        ctrl.event[evt][field  + 'invalid'] = true;
                        return {invalid: true};
                    }
                }
                ctrl.event[evt][field + 'invalid'] = false;
                return {invalid: false};
         }                 
        
        
        ctrl.validateDisplayLevel = function(evt, field, attr){
            if (ctrl.invalidRiskLevel(evt, field, attr).invalid)
                return false;
            ctrl.validateEvent(evt); 
            ctrl.displayLevel(evt, field);
        }
        
        ctrl.evtValid = function(evt){
            return ValidationService.evtValid(evt, $scope);
        }
        
        ctrl.validateEvent = function(evt){
            ValidationService.evtValid(evt, $scope);
        }
        
        ctrl.eventDirty = function(evt){
            return ValidationService.evtDirty(evt, $scope);
        }                                                  
        
        ctrl.validateLevel = function(evt){
             ctrl.displayLevel(evt);                                       
             
        }
        ctrl.closeEnabled = function(event){
            if (event >= 1)
                return ValidationService.baselineValid(event, $scope) && ValidationService.scheduleValid(event, $scope) && (ctrl.actualValid(event-1).value && ctrl.actualDisabled(event-1) && ctrl.event[event-1].riskstate == 'Closed');   
                
        }
        
        ctrl.actualDisabled = function(event){
            return !ctrl.closeEnabled(event) && (ctrl.actual[event].disabled || (ctrl.actualValid(event).value || ((ctrl.nextActualRiskEventId == event) && event == ctrl.lastEventIdSaved)))
        }
        
         ctrl.disable = function(evt){
            ctrl.disabled[evt].value = true;
        }
        
          ctrl.disableActual = function(evt){
            ctrl.actual[evt].disabled = true;
        }
        
        ctrl.enable = function(evt){ 
           ctrl.disabled[evt].value = false;
           elems = document.querySelectorAll(".evt"+evt);
        }
        
        ctrl.actualValid = function(evt){
            return {value: ValidationService.actualValid(evt, $scope)};
        }
        
        ctrl.complete = function(evt){
        
            if (ValidationService.actualValid(evt, $scope))
            {
               ctrl.clearSchedule(evt);    
               ctrl.disableActual(evt);
               ctrl.nextActualRiskEventId++;
               ctrl.actual[ctrl.nextActualRiskEventId].disabled = false;
            }
            
            nextDate = ctrl.nextDate(ctrl.event[evt].actualdate);
            
            if (ctrl.event[evt+1]){
                ctrl.event[evt+1].inlineActualOptions = {
                    customClass: getDayClass,
                    minDate: nextDate,
                    showWeeks: true  
                  };
                ctrl.event[evt+1].actualdateOptions = {
                     dateDisabled: disabled,
                     minDate: nextDate,
                     formatYear: 'yy',    
                     startingDay: 1  
                  };
           }         
        }
        
        ctrl.add = function(evt){   
            if (evt < 5 && ctrl.event.length > 0)
            {
                      scheduledate = new Date(ctrl.event[evt].scheduledate);
                      baselinedate = new Date(ctrl.event[evt].baselinedate);
                      scheduledate.setDate(scheduledate.getDate()+((evt==0)? 2 : 1));
                      baselinedate.setDate(baselinedate.getDate()+((evt==0)? 2 : 1));
                     
                      //alert(scheduledate + " " + baselinedate);

                      if (evt > 0)
                      {
                        y = scheduledate.getFullYear();
                        m = scheduledate.getMonth()+1;
                        d = scheduledate.getDate();
                        schdate = y+((m<10)?'-0'+m:'-'+m)+((d<10)?'-0'+d:'-'+d);   
                      }
                      
                      y = baselinedate.getFullYear();
                      m = baselinedate.getMonth()+1;
                      d = baselinedate.getDate();
                      basdate = y+((m<10)?'-0'+m:'-'+m)+((d<10)?'-0'+d:'-'+d);   

                      if (evt == 0)
                      {
                         schdate = basdate;
                      }  

                      //console.log(ctrl.event);
                      ctrl.event.push({
                        eventid: evt+1,
                        eventtitle: '',
                        eventownerid: '',
                        actualdate: '',
                        scheduledate: '',
                        baselinedate: '',
                        
                        actuallikelhiood: '',
                        actualtechnical: '',
                        actualschedule: '',
                        actualcost: '',
                        baselinelikelihood: '',
                        baselinetechnical: '',
                        baselineschedule: '',
                        baselinecost: '',
                        scheduledlikelihood: '',
                        scheduledtechnical: '',
                        scheduledschedule: '',
                        scheduledcost: '',
                 
                     
                 
                      inlineScheduleOptions: {
                        customClass: getDayClass,
                        //minDate: schdate,
                        showWeeks: true
                      },  
                      inlineBaselineOptions: {
                        customClass: getDayClass,
                        minDate: basdate,
                        showWeeks: true
                      },
                     
                      scheduledateOptions:{
                        dateDisabled: disabled,
                        formatYear: 'yy',
                        //minDate: schdate,     
                        startingDay: 1
                      },
                      baselinedateOptions:{
                        dateDisabled: disabled,
                        formatYear: 'yy',
                        minDate: basdate,           
                        startingDay: 1
                      }
               });
            
               //console.log(ctrl.event);
             }
             
             if (evt < 5)
                ctrl.disabled[0].value = true;
             if (evt >= 1) {
                ctrl.disable(evt);
             } 
             if (evt <= 5){  
                ctrl.validateEvent(evt);
                if ((ctrl.event[evt] && ctrl.event[evt].valid))
                    ctrl.lastEventIdSaved++;
             }
              
             if (ctrl.nextActualRiskEventId == evt)
             {
                 ctrl.actual[evt].disabled = true;
             }
                  
             if (evt < 5)
                ctrl.enable(evt+1);                                                  
           }
        
           ctrl.remove = function(evt){
                if (evt == ctrl.nextActualRiskEventId-1)
                    ctrl.nextActualRiskEventId--;
               
               
                ctrl.disable(evt); 
                ctrl.disableActual(evt);
                ctrl.clearEvent(evt);   
                DOMops.clearLevel(evt);
                 
                ctrl.event.pop();
                //console.log(ctrl.event);
                ctrl.validateEvent(evt-1);   

                if (evt > 1)
                {                            
                    ctrl.enable(evt - 1);
                }                   
                ctrl.lastEventIdSaved--;
          
        }
      
        
        
        ctrl.clearSchedule = function(evt){
            ctrl.event[evt].scheduledate = '';
            ctrl.event[evt].scheduledlikelihood = '';
            ctrl.event[evt].scheduledtechnical = '';
            ctrl.event[evt].scheduledschedule = '';
            ctrl.event[evt].scheduledcost = '';
        }
        
        ctrl.clearEvent = function(evt){
            ctrl.event[evt] = 
                    {eventtitle: '',
                        eventownerid: '',
                        actualdate: '',
                        actuallikelihood: '',
                        actualtechnical: '',
                        actualschedule: '',
                        actualcost: '',
                        baselinedate: '',
                        baselinelikelihood: '',
                        baselinetechnical: '',
                        baselineschedule: '',
                        baselinecost: '',
                        scheduleddate: '',
                        scheduledlikelihood: '',
                        scheduledtechnical: '',
                        scheduledschedule: '',
                        scheduledcost: ''}
        }
        
        ctrl.nextDate = function (myDate) {
            date      = new Date(myDate);
            next_date = new Date(date.setDate(date.getDate()+1));
            return next_date;
        }

        ctrl.minDate = function(myDate) {
            date      = new Date(myDate);
            next_date = new Date(date.setDate(date.getDate()+2));
            return next_date;
        }
        
        ctrl.maxDate = function(myDate){
            date     = new Date(myDate);
            max_date = new Date(date.setDate(date.getDate()-1));
            return max_date;
        }
        
        ctrl.edit = function(evt){
            ctrl.enable(evt);
            ctrl.event[evt].edit = true;
            if (evt > 1)
                minDate = ctrl.nextDate(ctrl.event[evt-1].baselinedate);
            else
                minDate = ctrl.minDate(ctrl.event[evt-1].baselinedate);
            
            ctrl.event[evt].inlineBaselineOptions = {
                customClass: getDayClass,
                minDate: minDate,
                showWeeks: true  
              };
            ctrl.event[evt].baselinedateOptions = {
                 dateDisabled: disabled,
                 minDate: minDate,
                 formatYear: 'yy',    
                 startingDay: 1  
              };    
            if (evt < 5 && ctrl.event[evt+1])
            {
             maxDate = ctrl.maxDate(ctrl.event[evt+1].baselinedate);
             ctrl.event[evt].inlineBaselineOptions['maxDate'] = maxDate;
             ctrl.event[evt].baselinedateOptions['maxDate'] = maxDate;   
            }
            
            
            if (evt > 1)
                minDate = ctrl.nextDate(ctrl.event[evt-1].scheduledate);
            else if (ctrl.event[evt-1].scheduledate != null)
                minDate = ctrl.minDate(ctrl.event[evt-1].scheduledate);
      
            
            ctrl.event[evt].inlineScheduleOptions = {
                customClass: getDayClass,
                showWeeks: true  
              };
              ctrl.event[evt].scheduledateOptions = {
                 dateDisabled: disabled, 
                 formatYear: 'yy',    
                 startingDay: 1  
              };
   
            
            if (evt > 1 && ctrl.event[evt-1].scheduledate != null)
            {
                ctrl.event[evt].inlineScheduleOptions['minDate'] = minDate;
                ctrl.event[evt].scheduledateOptions['minDate'] = minDate;  
            }
            if (evt < 5 && ctrl.event[evt+1])
            {
                maxDate = ctrl.maxDate(ctrl.event[evt+1].scheduledate);
                ctrl.event[evt].inlineScheduleOptions['maxDate'] = maxDate;
                ctrl.event[evt].scheduledateOptions['maxDate'] = maxDate;   
            }
        }
        
        ctrl.update = function(evt){
            ctrl.disable(evt);
            ctrl.event[evt].edit = false;
        }
        
        ctrl.getEvents = function(riskid){
             ctrl.evts = [];
             ctrl.event = [];
             ctrl.evtCopy = [];
             ctrl.lastEventIdSaved = 0;
             ctrl.disabled = [{value: true},{value: true},{value: true},{value: true},{value: true},{value: true}];
             ctrl.actual = [{opened: false, disabled: true},{opened: false, disabled: true},{opened: false, disabled: true},{opened: false, disabled: true},{opened: false, disabled: true},{opened: false, disabled: true}];
                         
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
                            ctrl.event[key].eventownerid = event.eventownerid;
                            ctrl.event[key].actualdate = event.actualdate;
                            ctrl.event[key].scheduledate = event.scheduledate;
                            ctrl.event[key].baselinedate = event.baselinedate;
                            ctrl.event[key].actuallikelihood = event.actuallikelihood;
                            ctrl.event[key].actualtechnical = event.actualtechnical;
                            ctrl.event[key].actualschedule = event.actualschedule;
                            ctrl.event[key].actualcost = event.actualcost;
                            ctrl.event[key].scheduledlikelihood = event.scheduledlikelihood;
                            ctrl.event[key].scheduledtechnical = event.scheduledtechnical;
                            ctrl.event[key].scheduledschedule = event.scheduledschedule;
                            ctrl.event[key].scheduledcost = event.scheduledcost;
                            ctrl.event[key].baselinelikelihood = event.baselinelikelihood;
                            ctrl.event[key].baselinetechnical = event.baselinetechnical;
                            ctrl.event[key].baselineschedule = event.baselineschedule;
                            ctrl.event[key].baselinecost = event.baselinecost;
                         }
                         
                         ctrl.actualDateOptions1 = {
                                dateDisabled: disabled,
                                customClass: getDayClass,
                                minDate: ctrl.nextDate(ctrl.event[0].actualdate), 
                                showWeeks: true  
                              };
                         
                         
                         if (response.data.Result.length)
                            ctrl.lastEventIdSaved = response.data.Result.length-1;
                         else
                            ctrl.lastEventIdSaved = 0;
                        ctrl.add(ctrl.lastEventIdSaved);
                      
                         ctrl.copyEvent();
                         
                        ctrl.initDone  = true;
                        ctrl.eventsdone = true;
                        ctrl.nextActualRiskEventId = 1;    
                        
                        for (e = 1; e <= 5; e++)
                        {
                            if (ValidationService.actualValid(e, $scope))
                            { 
                               ctrl.nextActualRiskEventId = e+1;
                               ctrl.actual[e].disabled = true;
                            }   
                        }
                        
                        ctrl.event[ctrl.nextActualRiskEventId].actualdateOptions = {
                             dateDisabled: disabled,
                             minDate: ctrl.minDate(ctrl.event[ctrl.nextActualRiskEventId-1].actualdate),
                             formatYear: 'yy',    
                             startingDay: 1  
                          };
       
                    }
       
                    return response.data.Result;
               }).then(() => {ctrl.rebindDates();});
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
                        ctrl.risk.riskstate = response.data.Result.riskstate; 
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
         
        function Base64Encode(str, encoding = 'utf-8') {
            var bytes = new (typeof TextEncoder === "undefined" ? TextEncoderLite : TextEncoder)(encoding).encode(str);        
            return base64js.fromByteArray(bytes);
        }

        function Base64Decode(str, encoding = 'utf-8') {
            var bytes = base64js.toByteArray(str);
            return new (typeof TextDecoder === "undefined" ? TextDecoderLite : TextDecoder)(encoding).decode(bytes);
        }
        
        ctrl.getRiskReport = function(){
            $http.get('api/risk/' + ctrl.risk.riskid + '/report', 
            {responseType:'arraybuffer'})
              .then(function (response) {
                 var file = new Blob([response.data], {type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', charset: 'utf-8'});
                 var downloadLink = angular.element('<a style="display:none"></a>');
                 downloadLink.attr('href',window.URL.createObjectURL(file));
                 downloadLink.attr('target', '_blank');
                 downloadLink.attr('download', 'RiskSummary.pptx');
                 downloadLink[0].click();
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
            field = ['actual', 'scheduled', 'baseline'];
            for (e = 1; e < ctrl.event.length; e++)
                for(f = 0; f < field.length; f++ )    
                    ctrl.displayLevel(e, field[f]);
            ctrl.levelsready = true;
        }
        
        ctrl.fetchRisk = function(page){
                ctrl.levelsready = false;   
                ctrl.lastEventIdSaved = 0;
               
                return ctrl.getRiskConfig()
                    .then(()=> {return ctrl.getUsers()
                        .then(()=>{return ctrl.getRiskDetails(page)
                            .then(()=>{return ctrl.getEvents(ctrl.risk.riskid)
                            });
                        });  
                    }).then(()=>{return ctrl.displayLevels()});
        }
               
}]).filter('unquote', function () {
    return function(value) {
        if(!angular.isString(value)) {
            return value;
        }  
        return value.replace(/^['"]+$/g, ''); // you could use .trim, but it's not going to work in IE<9
    };
});
