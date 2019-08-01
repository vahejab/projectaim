angular.module('Risk').controller('EditRiskController', ['$http', '$resource', '$stateParams', '$scope', '$state', '$timeout', '$sce', 'CommonService', 'DOMops', 'ValidationService',/*'DTOptionsBuilder',*/ function($http, $resource, $stateParams, $scope, $state, $timeout, $sce, CommonService, DOMops, ValidationService/*, DTOptionsBuilder*/){
        refresh = false;
        var ctrl = this;
        ctrl.clicked = false;
        ctrl.config = {}
        ctrl.lastEventIdSaved  = 1;        
        ctrl.DOMops = DOMops;
        ctrl.ValidationService = ValidationService;
        ctrl.CommonService = CommonService;
        ctrl.showAddButton =  {value: false } 
        ctrl.doRemoveAdd = [true, true, true, true, true, true];
        ctrl.complete = [{value: false},{value: false},{value: false},{value: false},{value: false},{value: false}];
        ctrl.initDone = false;
        ctrl.userDone = false;
        ctrl.eventsdone = false;
        ctrl.hideButton = false;
        ctrl.setup = {
            done: false
        }
        

        ctrl.risk = {
        }  
        
        ctrl.enabledItem = [false, false, false, false, false, false];
       
        ctrl.evt = [];
        ctrl.event = [{
                eventid: 0,
                eventtitle: '',
                ownerid: '',
                actualdate: '',
                scheduledate: '',
                scheduledlikelihood: '',
                scheduledtechnical: '',
                scheduledschedule: '',
                scheduledcost: ''
        }];
        
        for(var e = 1; e <= 5; e++)
        { 
            ctrl.event[e] = {
                eventid: e,
                eventtitle: '',
                ownerid: '',
                actualdate: '',
                scheduledate: '',
                scheduledlikelihood: '',
                scheduledtechnical: '',
                scheduledschedule: '',
                scheduledcost: ''
            };                  
            ctrl.evt[e]= {valid: false};
        }
        
        ctrl.fields = [   
            'risktitle',
            'riskstatement',
            'context',
            'closurecriteria',
            'owner',
            'approver'
        ]
        
            
        ctrl.risklevels = {
            riskmaximum: '',
            riskhigh: '',
            riskmedium: '',
            riskminimum: ''
        }
        
        ctrl.riskMatrix = [];
        for(var l = 1; l <= 5; l++)
        {
            ctrl.riskMatrix[l] = [];
            for (var c = 1; c <= 5; c++)
            {
                ctrl.riskMatrix[l][c] = '';  
            }
        } 
                  
        ctrl.removeAdd = function(idx){
               if (ctrl.doRemoveAdd[idx-1])
               {
                     $timeout(function(){
                        document.getElementById("remove"+(idx)).click();
                    }, 5);
                    $timeout(function(){
                        ctrl.doRemoveAdd[idx-1] = false;
                        document.getElementById("add"+(idx-1)).click();
                        ctrl.doRemoveAdd = [true, true, true, true, true, true];
                    }, 10);              
               }
        }
            
            
        ctrl.getItemValueAndValidate = function(obj, model, field){
            CommonService.getItemValue(obj, model, 'risk', field);         
            DOMops.clearValidation(field);   
        }    
            
        ctrl.users = [];
                             
        $scope.clearValidation = function(id){
            (document.querySelector('#'+id+' > div.webix_control')).classList.remove("webix_invalid");
        } 
         
        $scope.$on("$destroy", function(){                                      
            angular.element(document.querySelector('link[href="/app/tool/risk/EditRisk.css"]')).remove();    
        });
        
        ctrl.getTextValue = function(obj, type, field){
              return CommonService.getTextValue(obj, ctrl, type, field);
        }
                     
        ctrl.getRisk = function(l, t, s, c){
            
            likelihood = Number(l);
            technical = Number(t);
            schedule = Number(s);
            cost = Number(c);
            consequence = Math.max(technical, schedule, cost);
            level = ctrl.riskMatrix[likelihood][consequence];
            risk = ctrl.getLevel(level, likelihood, technical, schedule, cost, consequence);
            return risk;
        }    
     
        ctrl.valid = function(){          
            return ValidationService.valid(ctrl, ctrl.fields);
        }
        
        ctrl.getDateValueAndValidate = function(obj, model, field){
            CommonService.getDateValue(obj, model, 'risk',  field);       
            $scope.clearValidation(field);
        }
        
        ctrl.showAdd = function(evt){
            return angular.element(document.getElementById("add"+evt)).css("display") == "block";
        }
        
        ctrl.getDateValue = function(field, evt){
            elem = document.querySelector("#"+evt + " > div.webix_view > div.webix_el_box > div.webix_inp_static");
            ctrl.event[evt][field] = elem.textContent; 
        }
        
        ctrl.clear = function(evt){
            ids = document.querySelectorAll("div.evt"+evt);
            for (var idx = 0; idx < ids.length; idx++){
                elem = ids[idx];
                id = elem.getAttribute("id"); 
                view_id = document.querySelector("#" + id.replace("{{event}}", id) + " > div.webix_view").getAttribute("view_id");
                viewid = view_id.replace('$', '');

                var el = document.querySelector("#" + id.replace("{{event}}", id));
                if (el && el.getAttribute('type') == 'datepicker')
                {
                    elem = document.querySelector("#" + id.replace("{{event}}", id) + " > div.webix_view > div.webix_el_box > div.webix_inp_static");
                    $$(viewid).setValue('');
                }
                else if (el && el.getAttribute('type') == 'richselect')
                {
                    document.querySelector("#" + id.replace("{{event}}", id) + " > div.webix_view > *").setAttribute("id", viewid);
                    $$(viewid).setValue(''); 
                }   
                else if (el && (el.getAttribute('type') == 'level' || el.getAttribute('type') == 'text'))
                {  
                  elem = document.querySelector("#" + id + " > div.webix_view > div.webix_el_box > input"); 
                  document.querySelector("#" + id + " > div.webix_view > *").setAttribute("id", viewid);               
                  elem.value = "";
                  elem.textContent = "";
                  elem.innerHTML = "";
                  elem.innerText = "";
                  $$(viewid).setValue('');
                }
            }
            
            $timeout(function(){
               // ValidationService.evtValid(evt-1);
                DOMops.clearLevel(evt);
            }, 5); 
            
            
        }
        
        ctrl.getDate = function(field, evt){
            elems = document.querySelectorAll("div.evt"+evt);
            var dateValue = '';
            for (idx = 0; idx < ids.length; idx++)
            {   
                elem = elems[idx];
                id = elem.getAttribute("id");
                view_id = document.querySelector("#" + id.replace("{{event}}", id) + " > div.webix_view").getAttribute("view_id");
                viewid = view_id.replace('$', '');

                var el = document.querySelector("#" + id.replace("{{event}}", id));
                if (el && el.getAttribute('type') == 'datepicker')
                {  
                    elem = document.querySelector("#" + id.replace("{{event}}", id) + " > div.webix_view > div.webix_el_box > div.webix_inp_static");
                    elemid = id;

                    if (elemid.substring(0, elemid.length-1) == field)
                    { 
                        dateValue = elem.innerHTML;
                    } 
                }
            }
            
            dateParts = dateValue.split('/');
            return dateParts[2]+'-'+dateParts[0]+'-'+dateParts[1];
        }
        
        
        ctrl.add = function(evt){
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
            if (evt < 5)
                ctrl.enable(evt+1); 
            ctrl.showAddButton = {value: false }
            //if (evt < 5)
            //    angular.element(document.getElementById("remove"+evt)).css("display", "none");
            if (evt < 5)
                ctrl.setDateLimits(evt);
            if (evt < 5)
                ctrl.lastEventIdSaved++;
            ctrl.disable(evt);
            if (evt == 5)
                ctrl.hideButton = true;
        }                           
     
        ctrl.remove = function(evt){
            if (evt != 1)            
                ctrl.disable(evt);
            //if (evt != 1)
            //    angular.element(document.getElementById("remove"+evt)).css("display", "none");
            ctrl.clear(evt);   
            ctrl.event.pop();
      
            if (evt == 1)
                return; 
            ctrl.enable(evt - 1);
            if (evt > 1)
                ctrl.showAddButton = {value: true }
                                      
            if (ctrl.lastEventIdSaved != 0) 
            {
                ctrl.complete[ctrl.lastEventIdSaved--] = {value: true}
            }
        }
        ctrl.setDateLimits = function(evt){

            ids = document.querySelectorAll("div.evt"+evt);
            for (var idx = 0; idx < ids.length; idx++){
                elem = ids[idx];
                id = elem.getAttribute("id");
                view_id = document.querySelector("#" + id.replace("{{event}}", id) + " > div.webix_view").getAttribute("view_id");
             
                var el = document.querySelector("#" + id.replace("{{event}}", id));
                if (el && el.getAttribute('type') == 'datepicker')
                {   
                    elem = document.querySelector("#" + id.replace("{{event}}", id) + " > div.webix_view > div.webix_el_box > div.webix_inp_static");
                    elemid = id;   
                    if (elemid.substring(0, elemid.length-1) == 'actualdate')
                    {                                                                 
                         actualDate = ctrl.getDate('actualdate', evt);
                         selector = "actualdate"+(evt+1);
                         $$(selector).getPopup().getBody().define('minDate', actualDate);
                         value = $$(selector).getPopup().getBody().getValue();
                         $$(selector).getPopup().getBody().showCalendar(value || actualDate);             
                         $$(selector).refresh();                                              
                    }
                    else if (elemid.substring(0, elemid.length-1) == 'scheduledate')
                    {
                         scheduleDate = ctrl.getDate('scheduledate', evt);
                         selector = "scheduledate"+(evt+1);
                         $$(selector).getPopup().getBody().define('minDate', scheduleDate);
                         value = $$(selector).getPopup().getBody().getValue(); 
                         $$(selector).getPopup().getBody().showCalendar(value || scheduleDate);
                         $$(selector).refresh();   
                    } 
                }
            }
        }

        
        ctrl.disable = function(evt){
            elems = document.querySelectorAll("div.evt"+evt);
            for(var idx = 0; idx < elems.length; idx++)
            {
                elem = elems[idx];
                id = elem.getAttribute("id");
                view_id = document.querySelector("#" + id.replace("{{event}}", id) + " > div.webix_view").getAttribute("view_id");
                viewid = view_id.replace('$', '');
                document.querySelector("#" + id.replace("{{event}}", id) + " > div.webix_view > *").setAttribute("id", viewid);
                $$(viewid).disable();
            }
        }
        
        ctrl.enable = function(evt){ 
           ctrl.enabledItem[evt] = true;
           elems = document.querySelectorAll("div.evt"+evt);
            for(var idx = 0; idx < elems.length; idx++)                    
            {
                elem = elems[idx];
                id = elem.getAttribute("id");
                view_id = document.querySelector("#" + id.replace("{{event}}", id) + " > div.webix_view").getAttribute("view_id");
                viewid = view_id.replace('$', '');
                document.querySelector("#" + id.replace("{{event}}", id) + " > div.webix_view > *").setAttribute("id", viewid);
                $$(viewid).enable();
            } 
           // ctrl.ValidationService.evtValid(evt);
            angular.element(document.getElementById("remove"+evt)).css("display", "block");
        }
        
        ctrl.enabled = function(evt){
            return ctrl.enabledItem[evt];
        }

        ctrl.getLevel = function(risk, l, t, s, c, cons){
           if (risk >= ctrl.risklevels.riskhigh)                                                                                      
               return  {level: 'H ' + l + '-' + cons, likelihood: l, technical: t, schedule: s, cost: c, cls: 'high', threshold: level};
           else if (risk < ctrl.risklevels.riskhigh  && risk >= ctrl.risklevels.riskmedium)
                return {level: 'M ' + l + '-' + cons, likelihood: l, technical: t, schedule: s, cost: c, cls: 'med', threshold: level};
           else if (risk < ctrl.risklevels.riskmedium)
                return {level: 'L ' + l + '-' + cons, likelihood: l, technical: t, schedule: s, cost: c, cls: 'low', threshold: level}
        }
        
        ctrl.complete = function(evt){
            return ValidationService.evtValid(evt);
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
               
}]).filter('unquote', function () {
    return function(value) {
        if(!angular.isString(value)) {
            return value;
        }  
        return value.replace(/^['"]+$/g, ''); // you could use .trim, but it's not going to work in IE<9
    };
});;
