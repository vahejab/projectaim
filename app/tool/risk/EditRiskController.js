angular.module('Risk').controller('EditRiskController', ['$http', '$resource', '$stateParams', '$scope', '$state', '$timeout', '$sce', 'CommonService', 'DOMops', 'ValidationService',/*'DTOptionsBuilder',*/ function($http, $resource, $stateParams, $scope, $state, $timeout, $sce, CommonService, DOMops, ValidationService/*, DTOptionsBuilder*/){
        refresh = false;
        var ctrl = this;
        ctrl.config = {}
        
        ctrl.DOMops = DOMops;
        ctrl.ValidationService = ValidationService;
        
        ctrl.initDone = false;
        ctrl.userDone = false;
        
        ctrl.setup = {
            done: false
        }

        ctrl.risk = {
        }

        ctrl.enabledItem = [false, true, false, false, false, false];
        ctrl.evt = [];
            
        for(var e = 1; e <= 5; e++)
        {
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
        
        ctrl.getItemValueAndValidate = function(obj, model, field){
            CommonService.getItemValue(obj, model, 'risk', field);         
            DOMops.clearValidation(field);   
        }    
            
        ctrl.users = [];
                             
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
        
        $scope.clearValidation = function(id){
            (document.querySelector('#'+id+' > div.webix_control')).classList.remove("webix_invalid");
        }
        
        ctrl.enable = function(evt){
           ctrl.enabledItem[evt] = true;
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
                }).then(function(response){
                
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
