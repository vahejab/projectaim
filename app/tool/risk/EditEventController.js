angular.module('Risk').controller('EditEventController', ['$http', '$resource', '$stateParams', '$location', '$scope', '$state', '$timeout', '$sce', 'CommonService', 'DOMops', 'ValidationService',/*'DTOptionsBuilder',*/ 
    function($http, $resource, $stateParams,  $location, $scope, $state, $timeout, $sce, CommonService, DOMops, ValidationService/*, DTOptionsBuilder*/){
        var ctrl = this;
              
        ctrl.DOMops = DOMops;
        ctrl.ValidationService = ValidationService;
        ctrl.DOMops.setValidationServiceObj(ValidationService);
        ctrl.CommonService = CommonService;
        ctrl.initDone = false;
        ctrl.userDone = false;
        ctrl.event = {};
        ctrl.riskMatrix = new Array(6);
        ctrl.risklevels = {}; 
        ctrl.eventid = 0;
        ctrl.riskid = 0;  
        ctrl.notReadyToApproveForClosure = true;
        
        ctrl.disabled = {value: true};
        ctrl.actual = {opened: false, disabled: true};
        ctrl.schedule = {opened: false, disabled: true};
        ctrl.baseline = {opened: false, disabled: true};

        // Disable weekend selection
        function disabled(data) {
            var date = data.date,
            mode = data.mode;
            return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        }

        ctrl.checkCompletedActualRisk = function(eventObj){
            ctrl.notReadyToApproveForClosure = !ctrl.actualValid(eventObj).value;
        }
        
        ctrl.actualValid = function(eventObj){
            return {value: ValidationService.actualValid(-1, $scope, eventObj)};
        }
        
            
        ctrl.baselineValid = function(eventObj){
            return {value: ValidationService.baselineValid(-1, $scope, eventObj)};
        }
        
            
        ctrl.scheduleValid = function(eventObj){
            return {value: ValidationService.scheduleValid(-1, $scope, eventObj)};
        }
        
                
         ctrl.hidepopups = function(){
               ctrl.actual.opened = false;
               ctrl.baseline.opened = false;
               ctrl.schedule.opened = false;
          }  
                  
          ctrl.openBaseline = function() {
            ctrl.hidepopups();
            ctrl.baseline.opened = true;
          };                  

          
          ctrl.openActual = function() {
            ctrl.hidepopups();
            ctrl.actual.opened = true;
          };

          ctrl.openSchedule = function() {
            ctrl.hidepopups();
            ctrl.schedule.opened = true;
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
         
        $scope.init = function(){
            ctrl.eventid = $stateParams.eid;
            ctrl.riskid = $stateParams.id;
            angular.element(document.querySelector('link[href="/app/tool/EditEvent.css"]')).remove();
            angular.element(document.querySelector('link[href="/app/css/bootstrap/bootstrap.min.css"]')).remove();   
            angular.element(document.querySelector('head')).append('<link type="text/css" rel="stylesheet" href="/app/tool/risk/EditEvent.css"/>');
            angular.element(document.querySelector('head')).append('<link type="text/css" rel="stylesheet" href="/app/css/bootstrap/bootstrap.min.css"/>');
            ctrl.fetchRiskEvent();
        }
            
        $scope.$on("$destroy", function(){
            formcheck = 0;    
            angular.element(document.querySelector('link[href="/app/tool/risk/EditEvent.css"]')).remove();
            angular.element(document.querySelector('link[href="/app/css/bootstrap/bootstrap.min.css"]')).remove();   
        });
        
        ctrl.drawActualDot = function(){
            setTimeout(function(){
                if (ctrl.actualValid(ctrl.event))
                    ctrl.DOMops.drawDot(ctrl.event.actuallikelihood, Math.max(ctrl.event.actualtechnical, Math.max(ctrl.event.actualschedule, ctrl.event.actualcost)), 'actual'); 
                }, 1);
        }
        
        ctrl.drawBaselineDot = function(){
            setTimeout(function(){
                if (ctrl.baselineValid(ctrl.event))
                    ctrl.DOMops.drawDot(ctrl.event.baselinelikelihood, Math.max(ctrl.event.baselinetechnical, Math.max(ctrl.event.baselineschedule, ctrl.event.baselinecost)), 'baseline');
                }, 1);
        }
        
        ctrl.drawScheduleDot = function(){
            setTimeout(function(){       
                if (ctrl.scheduleValid(ctrl.event))
                    ctrl.DOMops.drawDot(ctrl.event.scheduledlikelihood, Math.max(ctrl.event.scheduledtechnical, Math.max(ctrl.event.scheduledschedule, ctrl.event.scheduledcost)), 'schedule');
                }, 1);
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
        
        ctrl.riskLevel = function(l, c){
            elem = document.querySelector("div[name='risk["+l+"]["+c+"]']");
            risk = ctrl.riskMatrix[l][c];
            if (risk == '' )
                return (elem && elem.hasAttribute('class'))?
                        elem.getAttribute('class') :''; 
            
            if (risk >= ctrl.risklevels.riskhigh) 
                return 'cell high';
            else if (risk >= ctrl.risklevels.riskmedium && risk < ctrl.risklevels.riskhigh)
                return 'cell med';
            else if (risk < ctrl.risklevels.riskmedium)
                return 'cell low';
        }

          
          
        ctrl.fetchRiskEvent = function(){  
            ctrl.eventid = $stateParams.eid;
            ctrl.riskid = $stateParams.id;
            return ctrl.getRiskConfig()
                .then(() => {return ctrl.getEvent()})
                    .then(() => {return ctrl.getUser()});
        }
        
        
        ctrl.getUser  = function(){
            return $http.get('api/users/'+ctrl.event.eventownerid).then(function(response){
                    if (response.data.Succeeded){
                       //ctrl.users.push({id: 0, value: ''}
                       user = response.data.Result;
                       ctrl.event.eventowner = {id: user.id, name: user.name};
                       ctrl.userDone = true;
                       return response.data.Result;
                    }
                    else{
                         ctrl.msg += "<br />"+ $sce.trustAsHtml(response.data);
                    }
           }); 
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
        
        
        
        ctrl.getEvent = function(){
             ctrl.evts = [];
             ctrl.event = [];
             ctrl.evtCopy = [];
             ctrl.lastEventIdSaved = 0;
             ctrl.disabled = {value: true};
             ctrl.actual = {opened: false, disabled: true};
             
            return $http.get('api/risks/'+ctrl.riskid+'/events/'+ctrl.eventid).then(function(response){
                
                if (response.data.Succeeded){
                        var event = response.data.Result[0];
                        ctrl.event.eventid = ctrl.eventid;
                        ctrl.event.eventtitle = event.eventtitle;
                        ctrl.event.status = event.eventstatus;
                        ctrl.event.riskid = event.riskid;
                        ctrl.event.eventownerid = event.eventownerid;
                        ctrl.event.actualdate = event.actualdate;
                        ctrl.event.scheduledate = event.scheduledate;
                        ctrl.event.baselinedate = event.baselinedate;
                        ctrl.event.actuallikelihood = event.actuallikelihood || '';
                        ctrl.event.actualtechnical = event.actualtechnical || '';     
                        ctrl.event.actualschedule = event.actualschedule || '';
                        ctrl.event.actualcost = event.actualcost || '';
                        ctrl.event.scheduledlikelihood = event.scheduledlikelihood || '';
                        ctrl.event.scheduledtechnical = event.scheduledtechnical || '';
                        ctrl.event.scheduledschedule = event.scheduledschedule || '';
                        ctrl.event.scheduledcost = event.scheduledcost || '';
                        ctrl.event.baselinelikelihood = event.baselinelikelihood || '';
                        ctrl.event.baselinetechnical = event.baselinetechnical || '';
                        ctrl.event.baselineschedule = event.baselineschedule || '';
                        ctrl.event.baselinecost = event.baselinecost || '';
            
            
                     if (response.data.Result.length)
                        ctrl.lastEventIdSaved = response.data.Result.length-1;
                     else
                        ctrl.lastEventIdSaved = 0;
                    //ctrl.add(ctrl.lastEventIdSaved);
                  
                     //ctrl.copyEvent();
                     
                    ctrl.initDone  = true;
                    ctrl.eventsdone = true;
                    ctrl.nextActualRiskEventId = 1; 
                    
                    evt = ctrl.event.eventid;
            
                    scheduledate = new Date(ctrl.event.scheduledate);
                    baselinedate = new Date(ctrl.event.baselinedate);
                    ctrl.sheduledate = scheduledate.setDate(scheduledate.getDate()+((evt==0)? 2 : 1));
                    ctrl.baselinedate = baselinedate.setDate(baselinedate.getDate()+((evt==0)? 2 : 1));

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
                          
                    ctrl.event.actualdateOptions = {
                         //dateDisabled: function(){ return ctrl.actual.disabled;},
                         minDate: ctrl.minDate(ctrl.event.actualdate),
                         formatYear: 'yy',    
                         startingDay: 1  
                      };
                      
                   
                    ctrl.event.scheduledateOptions = {
                        //dateDisabled: function(){ return ctrl.schedule.disabled;},
                        formatYear: 'yy',
                        //minDate: schdate,     
                        startingDay: 1
                    };
                    ctrl.event.baselinedateOptions = {
                       //dateDisabled: function(){ return ctrl.baseline.disabled;},
                        formatYear: 'yy',
                        minDate: basdate,           
                        startingDay: 1
                    };
                 
                 }
                 return response.data.Result;              
             });
        }
    }       
]);   