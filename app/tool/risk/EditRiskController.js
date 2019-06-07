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
                riskid: 0,
                risktitle: '',
                status: 'Open',
                risklevel: '',
                assignor: 0,
                owner: 0,
                approver: 0,
                assessmentdate: '',
                risktitle: '',
                riskstatement: '',
                context: '',
                closurecriteria: '',
                approvernotes: '',
                ownercomments: ''
        }
        
            
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
            risk = ctrl.getLevel(level, likelihood, consequence);
            return risk;
        }    
     
            
        ctrl.getLevel = function(risk, l, c){
           if (risk >= ctrl.risklevels.riskhigh)
               return  {level: 'H ' + l + '-' + c, cls: 'high', threshold: level};
           else if (risk < ctrl.risklevels.riskhigh  && risk >= ctrl.risklevels.riskmedium)
                return {level: 'M ' + l + '-' + c, cls: 'med', threshold: level};
           else if (risk < ctrl.risklevels.riskmedium)
                return {level:'L ' + l + '-' + c, cls: 'low', threshold: level}
        }                                            
        
                               
        ctrl.submit = function(){
            ctrl.validateAll();
            if (!ctrl.valid())
                 ctrl.msg = "Please complete form and resubmit";
            else 
                //ctrl.risk.duedate = ctrl.split(ctrl.risk.duedate,'T')[0];
                //ctrl.risk.ecd = ctrl.split(ctrl.risk.ecd, 'T')[0];
                $http.put('/api/risks', ctrl.risk).then(function(response){
                    if (response.data.Succeeded){
                        $scope.msg = response.data.Result;
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
