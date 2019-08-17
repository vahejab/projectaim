angular.module('Risk').controller('EditRiskController', ['$http', '$resource', '$stateParams', '$scope', '$state', '$timeout', '$sce', 'CommonService', 'DOMops', 'ValidationService',/*'DTOptionsBuilder',*/ function($http, $resource, $stateParams, $scope, $state, $timeout, $sce, CommonService, DOMops, ValidationService/*, DTOptionsBuilder*/){
        var ctrl = this;
              
        ctrl.DOMops = DOMops;
        ctrl.ValidationService = ValidationService;
        ctrl.CommonService = CommonService;
        ctrl.risklevels = {};
        ctrl.riskMatrix = new Array(6);
        ctrl.users = [];
        ctrl.risk = {};
        ctrl.event = [{}];
        ctrl.initDone = false;
        
        
        
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
        
        ctrl.valid = function(){
            return true;    
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
               
}]).filter('unquote', function () {
    return function(value) {
        if(!angular.isString(value)) {
            return value;
        }  
        return value.replace(/^['"]+$/g, ''); // you could use .trim, but it's not going to work in IE<9
    };
});;
